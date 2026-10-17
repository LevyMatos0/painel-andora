import test from 'node:test';
import assert from 'node:assert/strict';
import { publicUser } from '../src/services/user.service.js';

test('perfil expõe os dados PT/EN e a foto, sem hash de senha ou colunas extras', () => {
  const row = {
    usr_codigo: 7, usr_nome: 'Ana', usr_email: 'ana@example.com',
    usr_telefone: '123', usr_cargo: 'Gestora', usr_cargo_ingles: 'Manager',
    usr_foto: 'ana.png', usr_bio: 'Biografia PT', usr_bio_ingles: 'Biography EN',
    usr_senha: 'private-password-hash', internal_data: 'private',
  };
  const profile = publicUser(row);
  assert.deepEqual(profile, {
    id: 7, nome: 'Ana', email: 'ana@example.com', telefone: '123',
    cargo: 'Gestora', cargo_ingles: 'Manager', foto: 'ana.png',
    bio: 'Biografia PT', bio_ingles: 'Biography EN',
  });
  assert.equal(Object.hasOwn(profile, 'usr_senha'), false);
  assert.equal(Object.hasOwn(profile, 'internal_data'), false);
  assert.equal(row.usr_senha, 'private-password-hash');
});

test('perfil de banco antigo preserva os nomes públicos e omite traduções ausentes no JSON', () => {
  const profile = JSON.parse(JSON.stringify(publicUser({
    usr_codigo: 3, usr_nome: 'Ana', usr_email: 'ana@example.com',
    usr_telefone: null, usr_cargo: 'Gestora', usr_foto: null, usr_bio: null,
    usr_senha: 'private-password-hash',
  })));
  assert.deepEqual(profile, {
    id: 3, nome: 'Ana', email: 'ana@example.com', telefone: null,
    cargo: 'Gestora', foto: null, bio: null,
  });
});
