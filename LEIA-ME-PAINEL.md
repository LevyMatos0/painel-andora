# Painel Andora atualizado — Windows

Este pacote reúne o painel visual enviado no RAR, em `painel-visual`, e a API corrigida, em `andora-back`. O site público continua no repositório `LevyMatos0/Andora-vue`.

## Abrir no Windows

1. Baixe o ZIP e use **Extrair tudo**. Não execute de dentro do ZIP.
2. Instale o **Node.js 24 LTS** pelo site https://nodejs.org, caso ainda não esteja instalado. Mantenha o MySQL em execução.
3. Copie o arquivo **`.env` da sua API atual** para a pasta **`andora-back` deste pacote**. Ele deve apontar para seu banco local existente, com os valores corretos de `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` e `JWT_SECRET`. Não envie senhas pelo chat.
4. Copie também a pasta **`uploads` da API atual** para `andora-back/uploads`, para preservar as fotos e imagens cadastradas.
5. Feche as janelas que estiverem executando a versão antiga da API e do painel, liberando as portas 3000 e 5173.
6. Dê dois cliques em **`INICIAR-PAINEL.cmd`**, na pasta principal deste pacote. Ele abre duas janelas, instala as dependências na primeira execução e inicia a API e o painel. Deixe ambas abertas.
7. No navegador, digite **http://localhost:5173**. Entre com seu e-mail e senha já cadastrados no banco.

Se não houver `.env`, o iniciador cria uma cópia do exemplo, abre o Bloco de Notas e pede para você completar a configuração antes de tentar novamente. O exemplo não contém suas credenciais.

**Não é necessário recriar ou reimportar o banco.** Esta versão usa o modelo SQL com os campos `_ingles` que você enviou anteriormente. Não há importação automática de SQL nem exclusão de dados no iniciador. O painel atualizado precisa da API atualizada deste mesmo pacote; trocar apenas os arquivos Vue mantém as rotas antigas da API.

## Alternativa pelo Prompt de Comando

Abra a pasta `andora-back` no Explorador, clique na barra de endereço, digite `cmd` e pressione Enter. Nessa janela:

```bat
npm ci
node src/server.js
```

Abra outra janela da mesma maneira, agora dentro da pasta `painel-visual`:

```bat
npm ci
npm run dev
```

API: porta **3000**. Painel: **5173**. Site público, quando iniciado separadamente: **5174**. Se precisar de outra porta para a API, configure `PORT` no `.env` da API e `VITE_API_URL` no `.env` do painel conforme `painel-visual/.env.example`; reinicie ambos.

## O que mudou

- Dashboard consulta o banco: totais e registros ativos de serviços, equipe e FAQ; seções preenchidas; completude; mensagens novas e cinco mensagens recentes. Os cartões e as seções abrem suas telas de edição. O botão Atualizar consulta novamente os dados.
- Completude considera seis seções. Hero e Sobre precisam de texto e imagem; Contato, de endereço, telefone e e-mail; Serviços, Equipe e FAQ, de ao menos um registro ativo. Não indica aprovação ou publicação externa.
- Usuário carrega e salva pelo perfil autenticado (`GET/PUT /api/perfil`), mesmo sem ID de usuário em cache. Cargo e apresentação em português/inglês persistem. Foto pode ser trocada/removida; nome, cargo e avatar atualizam na sidebar.
- Troca de senha usa `PUT /api/perfil/senha`, confere a senha atual e salva o hash da nova senha. O formulário exibe falhas e confirmações.
- Menu de celular abre e fecha; navegação fecha o menu. Formulários e dashboard se adaptam à largura da tela.
- Serviços e equipe enviam traduções e usam imagens da API configurada. Mensagens mostram a data correta e são marcadas como lidas ao abrir.
- O proxy do Vite encaminha `/api` e `/uploads` para o backend durante o desenvolvimento.

## Verificação realizada

Build de produção do painel e seis testes existentes da API passaram. Testes em navegador com a API real e um MySQL temporário separado validaram login; perfil sem ID no cache; persistência PT/EN; upload e remoção de foto; sidebar; senha; cadastro de serviço/equipe em inglês; dashboard; mensagens; falhas visíveis; navegação e largura das seis telas em 320, 390, 768 e 1440 px.

Os iniciadores `.cmd` são atalhos para os comandos acima. Foram escritos para Windows; a validação automatizada foi executada em Linux, com Chromium, Node e MySQL. Seu banco local não foi acessado nem modificado nesses testes.
