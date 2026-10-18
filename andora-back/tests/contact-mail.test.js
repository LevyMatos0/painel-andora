import test from 'node:test';
import assert from 'node:assert/strict';
import { sendContactEmail, notifyContact } from '../src/services/contact-mail.service.js';
import { contactInput } from '../src/utils/contact-input.js';

const message = { id: 7, nome: 'Visitante', email: 'visitor@example.com', assunto: 'Orçamento', conteudo: 'Mensagem de teste', telefone: '123' };
const env = { SMTP_HOST: 'smtp.gmail.com', SMTP_USER: 'test@example.com', SMTP_PASSWORD: 'synthetic-test-only', CONTACT_EMAIL: 'recipient@example.com' };

test('aviso usa destinatário fixo, remetente autenticado e replyTo do visitante', async () => {
  let options, mail, closed = false;
  const result = await sendContactEmail(message, { env, createTransport(value) {
    options = value;
    return { async sendMail(value) { mail = value; return { accepted: [env.CONTACT_EMAIL] }; }, close() { closed = true; } };
  } });
  assert.equal(result.status, 'enviado');
  assert.equal(options.secure, true);
  assert.equal(options.auth.user, env.SMTP_USER);
  assert.equal(mail.from.address, env.SMTP_USER);
  assert.equal(mail.to, env.CONTACT_EMAIL);
  assert.equal(mail.replyTo.address, message.email);
  assert.match(mail.text, /Mensagem de teste/);
  assert.match(mail.text, /Telefone: 123/);
  assert.equal(mail.html, undefined);
  assert.ok(closed);
});

test('sem credenciais, o contato continua funcionando sem tentar enviar e-mail', async () => {
  assert.deepEqual(await sendContactEmail(message, { env: {}, createTransport() { throw Error('must not be called'); } }), { status: 'desativado' });
});

test('SMTP indisponível preserva o resultado do contato e não vaza resposta ou senha no log', async () => {
  const logs = [];
  const result = await notifyContact(message, async () => { throw Object.assign(Error('sensitive SMTP response'), { code: 'EAUTH' }); }, { warn(value) { logs.push(value); } });
  assert.equal(result.status, 'pendente');
  assert.match(logs[0], /EAUTH/);
  assert.match(logs[0], /#7/);
  assert.ok(!logs[0].includes('sensitive'));
});

test('contato rejeita e-mail inválido, objetos, campos vazios, excessos e quebras nos cabeçalhos', () => {
  for (const data of [{ email: 'invalid' }, { nome: {} }, { assunto: ' ' }, { nome: 'x'.repeat(101) }, { email: 'a@b.com\r\nBcc:other@example.com' }, { assunto: 'Assunto\nBcc' }]) {
    assert.throws(() => contactInput({ ...message, ...data }), error => error.status === 400);
  }
  const data = contactInput({ ...message, nome: ' Visitante ', to: 'attacker@example.com' });
  assert.equal(data.nome, 'Visitante');
  assert.equal(data.to, undefined);
});
