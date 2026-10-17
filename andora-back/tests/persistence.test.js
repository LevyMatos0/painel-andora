import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeActive, normalizeOrder, pickFields, validateText } from '../src/utils/persistence.js';

test('campos permitidos aceitam aliases e ignoram propriedades extras e herdadas', () => {
  const data = Object.assign(Object.create({ nome: 'herdado' }), {
    usr_nome: 'Ana', cargo_ingles: '', usr_cargo_ingles: 'ignorado', bio_ingles: null,
    malicious_column: 'não deve chegar ao SQL',
  });
  assert.deepEqual(pickFields(data, {
    usr_nome: ['nome', 'usr_nome'], usr_cargo_ingles: ['cargo_ingles', 'usr_cargo_ingles'],
    usr_bio_ingles: ['bio_ingles', 'usr_bio_ingles'],
  }), { usr_nome: 'Ana', usr_cargo_ingles: '', usr_bio_ingles: null });
  assert.deepEqual(pickFields(undefined, { nome: ['nome'] }), {});
});

test('checkboxes JSON e FormData preservam true/false e 1/0', () => {
  for (const value of [true, 1, 'true', '1']) assert.equal(normalizeActive(value), 1);
  for (const value of [false, 0, 'false', '0']) assert.equal(normalizeActive(value), 0);
  for (const value of ['invalid', null, {}, '']) assert.throws(() => normalizeActive(value), { status: 400 });
});

test('ordem zero não vira um; ordens inválidas geram erro de entrada', () => {
  assert.equal(normalizeOrder(0), 0);
  assert.equal(normalizeOrder('0'), 0);
  assert.equal(normalizeOrder('2'), 2);
  assert.equal(normalizeOrder(''), 0);
  for (const value of [-1, 1.5, 'abc', 4294967296]) assert.throws(() => normalizeOrder(value), { status: 400 });
});

test('tradução nula permite limpeza, mas campos obrigatórios e objetos inválidos são rejeitados', () => {
  assert.doesNotThrow(() => validateText({ cargo_ingles: null, nome: 'Ana' }, ['nome']));
  assert.throws(() => validateText({ nome: ' ' }, ['nome']), { status: 400 });
  assert.throws(() => validateText({ cargo_ingles: {} }), { status: 400 });
});
