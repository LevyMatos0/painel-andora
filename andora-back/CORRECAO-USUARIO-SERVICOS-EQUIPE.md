# Correção: salvar usuário, serviços e equipe

Esta versão corrige três falhas da API: a rota de perfil não aceitava atualização, os serviços não gravavam as traduções e a equipe não gravava cargo/apresentação em inglês. O upload também passa a criar `uploads` quando necessário.

## Aplicar no Windows

1. Baixe o ZIP desta branch `codex/integracao-idiomas-site` e extraia em outra pasta.
2. Pare a API atual com **Ctrl+C** na janela onde executou `node src/server.js`.
3. No ZIP, abra `andora-back`. Copie a pasta **`src` completa** para dentro da sua pasta `andora-back` atual, escolhendo substituir os arquivos existentes. Isso inclui o arquivo novo **`src/utils/persistence.js`**, obrigatório para os serviços atualizados. Preserve o `.env`, `uploads`, o banco e as pastas do frontend.
4. Na janela de comandos da sua API atual, dentro de `andora-back`, execute novamente:

   ```bat
   node src/server.js
   ```

5. No painel, faça login novamente e teste salvar o perfil. Cadastre ou edite um serviço e um membro da equipe com os textos em inglês. Volte à aba do site e selecione EN.

Não é necessário baixar novamente o site público nem importar SQL. O banco deve ter as colunas `_ingles` do modelo bilíngue que você já utiliza.

Se preferir copiar arquivos individuais, os arquivos alterados nesta correção são:

- `src/utils/persistence.js` (**novo**)
- `src/routes/perfil.routes.js`
- `src/routes/user.routes.js`
- `src/controllers/user.controller.js`
- `src/controllers/servico.controller.js`
- `src/controllers/team.controller.js`
- `src/services/user.service.js`
- `src/services/servico.service.js`
- `src/services/team.service.js`
- `src/middlewares/upload.js`

Mantenha também os arquivos da correção anterior, que registram `/api/perfil` em `src/server.js` e `src/app.js`.

## Contrato dos formulários

### Usuário

`PUT /api/perfil` e `PATCH /api/perfil` salvam o usuário do token de login. Aceitam JSON ou FormData, com o upload no campo `foto`.

Campos: `nome`, `email`, `telefone`, `cargo`, `cargo_ingles`, `bio`, `bio_ingles`, `senha` e `foto`. Os nomes equivalentes do banco (`usr_nome`, `usr_cargo_ingles`, etc.) também são aceitos. Campos omitidos mantêm seus valores. Uma senha vazia mantém a senha anterior; uma nova senha é armazenada como hash.

`PUT /api/users/:id` e `PATCH /api/users/:id` também funcionam para o próprio usuário autenticado. Um usuário não pode trocar o ID para editar a conta de outra pessoa.

A resposta devolve o perfil salvo com os campos públicos e os aliases `usr_*` usados pelo painel. Após o sucesso, a tela de usuário pode avisar a sidebar com o evento já existente:

```js
window.dispatchEvent(new Event('perfilAtualizado'));
```

A API não dispara eventos no navegador: esse sinal deve continuar no formulário, após a confirmação da gravação. Apenas a sidebar foi fornecida no chat; o código completo de `Usuario.vue` ainda não estava disponível para executar a tela original.

### Serviços

`POST /api/servicos` e `PUT /api/servicos/:id` aceitam:

- `titulo`, `descricao`, `informacoes`
- `titulo_ingles`, `descricao_ingles`, `informacoes_ingles`
- `ordem`, `ativo` e imagem no campo `icone`

Os nomes `srv_*` equivalentes também são aceitos. Cadastro exige título e descrição. Cadastro sem imagem não tenta inserir NULL na coluna de ícone. Uma edição sem outra imagem preserva a anterior.

### Equipe

`POST /api/team` e `PUT /api/team/:id` aceitam:

- `nome`, `cargo`, `texto` (ou `apresentacao`)
- `cargo_ingles`, `texto_ingles` (ou `apresentacao_ingles`)
- `linkedin`, `github`, `ordem`, `status` e imagem no campo `foto`

Os nomes `tms_*` equivalentes também são aceitos. Cadastro exige nome e cargo. Edições parciais preservam nome, cargo, foto e traduções que não forem enviados.

Serviços/equipe aceitam estados booleanos JSON (`true`/`false`) e textos de FormData (`"true"`, `"false"`, `"1"`, `"0"`). Ordem zero permanece zero. Valores inválidos geram HTTP 400; IDs inexistentes em edição retornam 404.

Para limpar uma tradução explicitamente, envie `""` ou `null`. Omitir uma tradução em uma edição a preserva.

## Validação

Foram feitos testes reais de HTTP e MySQL temporário para gravação de usuário, troca de senha, foto, restrição ao próprio perfil, serviços/equipe em PT/EN, edição parcial e preservação de valores. Os testes unitários da API podem ser executados dentro de `andora-back` com:

```bat
node --test
```
