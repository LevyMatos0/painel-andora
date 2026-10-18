# Ativar o envio de contato para o Gmail

O formulário do site público envia `POST /api/mensagens`. A API salva o contato no MySQL e envia um aviso para o Gmail configurado. O painel mostra a mensagem na aba **Mensagens**.

## Configurar sua conta de teste

1. Entre na conta **tcc2026clm@gmail.com** no Google.
2. Em https://myaccount.google.com/security, ative a **Verificação em duas etapas**, se ainda não estiver ativa.
3. Abra https://myaccount.google.com/apppasswords e crie uma senha de app chamada **Andora**. Se a opção não estiver disponível, confira as regras da conta Google; algumas contas organizacionais não permitem esse recurso.
4. Abra o arquivo **`.env` dentro de `andora-back`**, mantendo a configuração atual do banco, e acrescente:

```dotenv
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=tcc2026clm@gmail.com
SMTP_PASSWORD=COLE_AQUI_A_SENHA_DE_APP_SEM_ESPACOS
CONTACT_EMAIL=tcc2026clm@gmail.com
```

Substitua apenas o valor de `SMTP_PASSWORD` pela senha de app gerada pelo Google. Não use a senha normal da conta, não coloque essa senha no Vue nem envie o `.env` para o GitHub ou pelo chat. Essa senha fica somente na API.

5. Como esta versão adiciona uma dependência de e-mail, abra um Prompt de Comando dentro de `andora-back` e execute **`npm ci`**. Para abrir o Prompt nessa pasta, clique na barra de endereço do Explorador, digite `cmd` e pressione Enter.
6. Encerre e reinicie a API com **`node src/server.js`**, nessa mesma janela. Deixe-a aberta. Inicie também o painel e o site público como antes.

O destinatário é `CONTACT_EMAIL`. O remetente autenticado é `SMTP_USER`; o e-mail informado pelo visitante é o endereço usado ao clicar **Responder** no Gmail. Você pode usar a mesma conta como remetente e destinatário no teste. Alterar o e-mail exibido na seção Contato do painel não altera as credenciais SMTP.

## Testar

1. Abra o **site público** em http://localhost:5174 e preencha o formulário de contato com nome, seu e-mail, assunto e mensagem.
2. Clique para enviar uma única vez e aguarde a confirmação.
3. Confira o registro na aba **Mensagens** do painel, em http://localhost:5173.
4. Confira a caixa de entrada de **tcc2026clm@gmail.com** e a pasta de spam. O assunto começa com **[Andora]**.
5. Ao responder pelo Gmail, o destinatário deve ser o e-mail preenchido pelo visitante.

O site público precisa apontar para esta API atualizada. Se ainda usa uma versão estática antiga do site, use a versão integrada da branch `codex/integracao-painel-site` do repositório `LevyMatos0/Andora-vue`.

## Se o e-mail não chegar

- Sem `SMTP_HOST`, `SMTP_USER` ou `SMTP_PASSWORD`, a API continua salvando contatos no painel, com a notificação por e-mail desativada.
- Com credenciais incorretas, a janela da API mostra **EAUTH**. Gere uma senha de app válida e confira o endereço da conta.
- **ECONNECTION**, **ESOCKET** ou **ETIMEDOUT** indicam falha de conexão SMTP; confira a rede, host e porta.
- Falha no e-mail não apaga o contato nem faz o formulário pedir novo envio: ele continua salvo no painel. Não há reenvio automático de notificações nesta versão; consulte as mensagens no painel. Ativar SMTP só envia avisos de novos contatos.

O envio real pelo Gmail depende da configuração da sua conta. Foram testados o fluxo completo de API/MySQL com servidor SMTP local usando TLS, os cabeçalhos de resposta, a falha de autenticação e a preservação do contato no banco. Nenhuma mensagem de teste foi enviada à sua conta Gmail durante o desenvolvimento.
