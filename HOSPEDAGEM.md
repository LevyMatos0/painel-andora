# Publicar a Andora: Vercel + Railway

O código está preparado para hospedar os frontends na Vercel e a API/MySQL no Railway. A publicação e a configuração das contas são feitas por você. Não há credenciais reais neste guia, e os serviços não foram criados automaticamente.

## Projetos e pastas

| Aplicação | Repositório | Root Directory | Execução/build |
|---|---|---|---|
| Painel administrativo | `LevyMatos0/painel-andora` | `andora-vue` | `npm run build`; saída `dist` |
| API | `LevyMatos0/painel-andora` | `andora-back` | `npm start` |
| Site público | `LevyMatos0/Andora-vue` | raiz do repositório | `npm run build`; saída `dist` |
| MySQL | Serviço MySQL no Railway | — | Oito tabelas do projeto |

Use Node.js **24.x**. Mescle as branches de preparação dos dois repositórios antes de selecionar `main` na hospedagem. A branch do site público também inclui a integração com o painel preparada anteriormente; a `main` antiga desse repositório não contém essa integração.

## 1. Railway: banco, API e imagens

1. Crie um projeto no Railway e adicione um serviço **MySQL**. Espere o banco ficar disponível.
2. Adicione outro serviço conectado ao GitHub: **`LevyMatos0/painel-andora`**.
3. No serviço da API, defina **Root Directory = `andora-back`**. Em **Config File Path / Config as Code**, use **`/andora-back/railway.json`**. Se configurar manualmente, os valores equivalentes são:
   - Pre-deploy command: `npm run db:init`.
   - Start command: `npm start`.
   - Healthcheck path: `/health`.
4. Adicione um **Volume ao serviço da API**, montado em **`/data/uploads`**. Configure `UPLOAD_DIR` com esse mesmo caminho. Comece com uma réplica da API; os limites de requisição são mantidos em memória nessa instância.
5. Em Networking, gere um domínio público HTTPS para a API e anote o endereço, por exemplo `https://sua-api.up.railway.app`.
6. Configure as variáveis abaixo. Não copie as credenciais do banco do seu computador: use as do MySQL da nuvem.

| Variável na API | Valor |
|---|---|
| `NODE_ENV` | `production` |
| `JWT_SECRET` | Chave aleatória privada, com pelo menos 32 caracteres |
| `TRUST_PROXY_HOPS` | `1` para uma camada de proxy do Railway |
| `UPLOAD_DIR` | `/data/uploads` |
| `FRONTEND_URLS` | Os dois endereços HTTPS de produção da Vercel, separados por vírgula |
| `DB_HOST` | Referência a `MySQL.MYSQLHOST` |
| `DB_PORT` | Referência a `MySQL.MYSQLPORT` |
| `DB_USER` | Referência a `MySQL.MYSQLUSER` |
| `DB_PASSWORD` | Referência a `MySQL.MYSQLPASSWORD` |
| `DB_NAME` | Referência a `MySQL.MYSQLDATABASE` |

Use **Add Reference** no editor de variáveis do Railway. Se o serviço tiver outro nome, selecione o nome real dele. Há um modelo em `andora-back/.env.production.example`. A API também aceita diretamente os nomes `MYSQLHOST`, `MYSQLPORT`, `MYSQLUSER`, `MYSQLPASSWORD` e `MYSQLDATABASE` se eles estiverem disponíveis no processo do serviço.

O Railway fornece `PORT` automaticamente. Não fixe a porta 3000 na nuvem. Para banco externo que exige TLS, use `DB_SSL=true` e, quando necessário, `DB_SSL_CA` com a CA do provedor. A verificação do certificado permanece habilitada.

Para gerar uma chave JWT no seu próprio terminal, execute:

```bat
node -e "console.log(require('node:crypto').randomBytes(48).toString('hex'))"
```

Copie o resultado diretamente para a variável privada `JWT_SECRET` no Railway. Não use a chave de exemplo nem publique o resultado. Trocar essa chave exige novo login dos usuários.

Crie os projetos Vercel das próximas etapas para obter os domínios e complete `FRONTEND_URLS`. Se o Railway tentar iniciar antes das variáveis ficarem completas, preencha-as e faça **Redeploy**. A API recusa a inicialização de produção sem chave válida, origens configuradas, conexão de banco configurada e caminho absoluto de uploads.

## 2. Vercel: painel

1. Importe **`LevyMatos0/painel-andora`**.
2. Defina **Root Directory = `andora-vue`** e Framework **Vite**.
3. Use `npm ci`, `npm run build` e Output Directory **`dist`**; `andora-vue/vercel.json` já registra esses valores.
4. Nas variáveis do ambiente **Production**, configure:

```dotenv
VITE_API_URL=https://SUA-API.up.railway.app/api
```

5. Faça o deploy e anote o domínio de produção do painel. Se alterar essa variável depois, faça **Redeploy**: o Vite incorpora o endereço durante o build.

Não coloque senha do banco, JWT_SECRET ou senha de app do Gmail em nenhuma variável `VITE_*`.

## 3. Vercel: site público

1. Importe **`LevyMatos0/Andora-vue`**, usando a versão integrada da branch de preparação.
2. Use a **raiz** como Root Directory, Framework **Vite**, `npm ci`, `npm run build` e saída **`dist`**.
3. Configure em Production:

```dotenv
VITE_API_BASE_URL=https://SUA-API.up.railway.app
```

O site aceita essa URL com ou sem `/api` no final. O modelo está em `.env.production.example` no repositório do site. O nome `VITE_API_URL` também é aceito como alternativa; escolha apenas uma variável para não ter dois endereços diferentes.

Anote o domínio de produção do site. Volte ao Railway e configure:

```dotenv
FRONTEND_URLS=https://SEU-PAINEL.vercel.app,https://SEU-SITE.vercel.app
```

Use somente a origem: sem `/api`, sem caminhos, sem `*`. Domínios próprios também precisam constar nessa lista. Uma URL temporária de preview diferente não recebe permissão automaticamente; adicione sua origem exata apenas se precisar usá-la.

Aguarde a atualização/republicação da API. O CORS não substitui autenticação: as rotas administrativas também conferem o token de login.

## 4. Banco inicial e primeiro acesso

O pre-deploy executa `npm run db:init`. Ele cria tabelas ausentes e acrescenta campos de tradução ausentes, sem `DROP`, sem apagar registros e sem redefinir senhas. Um banco com outra estrutura pode exigir uma migração específica: o `/health` recusa um esquema incompleto.

Se quiser preservar seus cadastros atuais, transfira uma exportação do banco local para o MySQL da nuvem. Faça isso usando suas credenciais do Railway em uma ferramenta MySQL, como o MySQL Workbench. Preserve o banco local e mantenha a exportação fora do GitHub; ela pode conter dados pessoais e hashes de senha. O código não acessa nem modifica o banco do seu computador durante a publicação.

**Se o banco da nuvem estiver vazio**, crie seu primeiro administrador no terminal do serviço da API. Com a CLI oficial do Railway instalada no seu computador:

```bat
railway login
railway link
railway ssh
```

Escolha o projeto, ambiente e serviço da API quando solicitado. **Dentro do serviço**, execute:

```sh
npm run admin:create
```

Informe nome, e-mail e uma senha de pelo menos 12 caracteres. A senha não aparece durante a digitação. O comando não redefine usuários existentes. Se importou seu cadastro do banco anterior, entre com suas credenciais existentes e pule esta criação.

O comando `npm run db:init` também pode ser executado nesse terminal para repetir a preparação. Não execute esses comandos no banco local se sua intenção for preparar o banco da nuvem.

## 5. Preservar fotos e imagens

O banco guarda os nomes dos arquivos; os arquivos ficam no volume da API. O GitHub não contém seus uploads locais.

Para preservar as imagens antigas, transfira o conteúdo da pasta `andora-back/uploads` do seu computador para o volume `/data/uploads`, mantendo os nomes. Como alternativa, reenvie as fotos e imagens pelas telas do painel; os novos nomes serão gravados no banco.

Não use somente o disco temporário da aplicação. Depois de enviar uma imagem, faça um Redeploy da API e confirme que ela continua abrindo. O código exige `UPLOAD_DIR` absoluto, mas quem garante a persistência na plataforma é o Volume que você anexou. Mantenha backups separados do MySQL e do volume.

Novos uploads aceitam PNG, JPEG, WebP e GIF de até 5 MB. SVG e arquivos executáveis não são aceitos. Arquivos são nomeados pela API, e os uploads só são processados depois da autenticação.

## 6. Contato e Gmail

As mensagens do formulário sempre são gravadas primeiro no banco. A notificação por e-mail é opcional e fica configurada apenas na API:

```dotenv
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=tcc2026clm@gmail.com
SMTP_PASSWORD=SENHA_DE_APP_DO_GOOGLE
CONTACT_EMAIL=tcc2026clm@gmail.com
```

Gere uma senha de app na conta Google com verificação em duas etapas. Veja `andora-back/CONTATO-GMAIL.md`. Não coloque essa senha no Vue.

**Confirme se o plano do Railway permite SMTP de saída**, inclusive a porta escolhida. Se a plataforma bloquear essa conexão, o Gmail não receberá o aviso mesmo com senha correta. Nesse caso, use um plano/hospedagem que permita SMTP ou prepare integração com um provedor de e-mail por HTTPS. A API preserva a mensagem na aba Mensagens quando o envio de e-mail falha; não há reenvio automático.

## 7. Conferir a publicação

- Abra `https://SUA-API.up.railway.app/health`: deve responder `{"status":"ok"}`. HTTP 503 indica conexão ou esquema do banco incompleto.
- Faça login no painel e salve um campo de perfil. Recarregue e confira a persistência.
- Cadastre um serviço ativo e outro inativo. O painel mostra ambos; o site público mostra somente o ativo.
- Envie uma mensagem pelo site, confira na aba Mensagens e, se configurado, no Gmail.
- Reimplante a API e confira uma imagem enviada anteriormente.

Sem login, `/api/mensagens`, operações de alteração de conteúdo, uploads, usuários e dashboard devem responder 401. O formulário público continua aceitando mensagens. Conteúdo público continua disponível sem login.

Há limites por IP: cinco contatos por 15 minutos e dez tentativas de login malsucedidas por 15 minutos. HTTP 429 pede uma pausa antes de tentar novamente.

## Validação desta preparação

Foram executados testes da API, testes do site e builds dos dois frontends. Um MySQL temporário separado validou a criação do banco, a migração sem apagar usuários, o login, a leitura pública/privada e a persistência de imagens após reiniciar a API em produção. Também foi testado no navegador o site e o painel compilados comunicando-se com uma API em outra origem. O SMTP foi validado com um servidor local de teste usando TLS.

Essas verificações não substituem o teste nos seus serviços reais. Domínios, credenciais, volume do Railway e entrega pelo Gmail precisam ser configurados e conferidos na sua conta antes de considerar a publicação concluída.
