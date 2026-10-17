# Gravação e leitura dos campos em inglês

Esta branch inclui a leitura e a gravação das traduções de Hero, About e FAQ. Os formulários do painel não foram alterados. O banco deve possuir as colunas `_ingles` do modelo bilíngue enviado pelo usuário; não reimporte o SQL sobre dados existentes, pois ele contém `DROP TABLE`.

## Atualizar sua API no Windows

Baixe o ZIP desta branch `codex/integracao-idiomas-site` no GitHub e extraia em outra pasta. Copie apenas estes dois arquivos para a mesma localização na sua API atual:

- `andora-back/src/services/site.service.js`
- `andora-back/src/services/faq.service.js`

Preserve `.env`, `uploads` e os demais arquivos. Pare a API com Ctrl+C e inicie novamente com `node src/server.js` dentro de `andora-back`. Se já atualizou o site para alternar PT/EN, não é necessário baixar o site novamente para esta correção de gravação.

## Campos enviados pelo painel

As rotas abaixo mantêm a autenticação existente. O painel deve incluir estes campos no corpo da requisição:

| Rota | Campos de tradução |
| --- | --- |
| `POST /api/site`, `secao=hero` | `titulo_ingles`, `descricao_ingles` |
| `POST /api/site`, `secao=sobre` | `titulo_ingles`, `texto_ingles` |
| `POST /api/faqs` e `PUT /api/faqs/:id` | `pergunta_ingles`, `resposta_ingles` |

Hero/About também aceitam `her_titulo_ingles`, `her_descricao_ingles`, `abt_titulo_ingles` e `abt_texto_ingles`, conforme a seção. FAQ também aceita `faq_pergunta_ingles` e `faq_resposta_ingles`. Quando os dois nomes de um mesmo campo são enviados, o nome público sem o prefixo da tabela tem prioridade.

Exemplo de Hero, mantendo os campos em português que o painel já envia:

```json
{
  "secao": "hero",
  "titulo": "Inovação",
  "descricao": "Soluções para sua empresa",
  "titulo_ingles": "Innovation",
  "descricao_ingles": "Solutions for your business"
}
```

O formulário de Hero/About pode enviar esses mesmos campos como `FormData`. O upload continua usando o campo `imagem`. No primeiro cadastro, inclua a imagem exigida pelo modelo SQL. Ao editar sem enviar outra imagem, a imagem anterior é mantida.

FAQ usa JSON e mantém os campos originais `pergunta`, `resposta`, `ordem` e `status`.

Uma tradução omitida não é apagada em uma edição. Enviar `""` ou `null` limpa explicitamente aquela tradução. A API continua aceitando gravações em português no esquema antigo quando nenhum campo inglês é enviado.

Confira o resultado após salvar em `GET /api/site` ou `GET /api/faqs`. Os campos normalizados retornados são os mesmos que o site utiliza ao alternar para EN. Se os campos acima não estiverem no corpo enviado pelo painel, será necessário conferir o código desse formulário; a API não pode gravar um valor que não recebeu.

## Usuários e dados para a sidebar

O cadastro de usuário também aceita `cargo_ingles` e `bio_ingles`, ou os nomes completos `usr_cargo_ingles` e `usr_bio_ingles`. O envio da foto permanece no campo `foto`. Os demais campos e a autenticação existente são preservados.

Para aplicar esta correção, atualize **também** estes dois arquivos na sua API, preservando as atualizações anteriores de Hero/About/FAQ:

- `andora-back/src/services/user.service.js`
- `andora-back/src/services/auth.service.js`

O serviço de autenticação importa a função de perfil do serviço de usuário; copie os dois arquivos juntos e reinicie a API.

Cadastro, listagem e login agora retornam os mesmos dados públicos de perfil:

| Campo | Informação |
| --- | --- |
| `id`, `nome`, `email` | Identificação do usuário |
| `telefone` | Telefone cadastrado |
| `cargo`, `cargo_ingles` | Cargo em PT/EN |
| `bio`, `bio_ingles` | Biografia em PT/EN |
| `foto` | Nome do arquivo da foto em `/uploads/` |

No login, o perfil permanece em `resposta.utilizador` e o token em `resposta.token`. O hash da senha e outras colunas internas não fazem parte do perfil público. O conteúdo do JWT e a validação de credenciais mantêm o comportamento existente.

A sidebar deve usar o perfil do usuário autenticado, escolher os campos ingleses ao selecionar EN (com retorno aos campos PT se estiverem vazios) e resolver a foto na raiz da API, em `/uploads/`. Se o painel guarda o perfil no navegador, saia e entre novamente após atualizar a API para obter os novos campos.

O componente da sidebar foi posteriormente fornecido no chat. A versão corrigida está em `integracao-painel/Sidebar.vue` na raiz deste repositório; siga `integracao-painel/LEIA-ME.md` para substituir o componente e atualizar a API com a rota autenticada `GET /api/perfil`.

Verificação do perfil público: `node --test tests/user-profile.test.js` dentro de `andora-back`. O cadastro e o login também foram validados por requisições reais contra MySQL temporário com o modelo bilíngue e contra o esquema antigo sem colunas inglesas.
