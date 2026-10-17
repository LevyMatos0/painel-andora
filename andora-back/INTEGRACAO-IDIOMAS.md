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
