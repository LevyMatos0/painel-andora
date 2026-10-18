# Painel administrativo Andora

Vue 3 + Vite, mantendo o visual azul/amarelo do painel enviado. Inclui dashboard com dados da API, edição de conteúdo PT/EN, serviços, equipe, mensagens e perfil autenticado.

Veja **[LEIA-ME-PAINEL.md](../LEIA-ME-PAINEL.md)** para baixar, configurar o banco existente e executar no Windows.

```bash
npm ci
npm run dev
```

Requer Node.js 24 LTS e a API deste pacote em funcionamento. Acesso local: http://localhost:5173. Não abra `index.html` diretamente.

## API e build

Sem configuração extra, o Vite encaminha `/api` e `/uploads` para http://localhost:3000. Para outra API, copie `.env.example` para `.env` e ajuste `VITE_API_URL`; reinicie o Vite. A variável aceita URL com ou sem `/api` no final.

```bash
npm run build
```

`dist` contém o build de produção. Em produção, configure `VITE_API_URL` antes do build, ou sirva `/api` e `/uploads` no mesmo domínio do painel usando seu proxy web. As rotas do painel usam hash. O build precisa de um servidor HTTP.

O projeto não contém banco, senhas de usuários, `.env` privado nem fotos cadastradas na API antiga. Preserve o `.env` e `uploads` da sua instalação.

## Pasta deste upload no GitHub

O conteúdo de `andora-vue.rar` está nesta pasta **andora-vue**, como arquivos normais do repositório. Para executá-lo, abra o terminal nesta pasta e use `npm ci` e `npm run dev`. Para gerar o build, use `npm run build`.

Se cadastrar este painel na Vercel, selecione **andora-vue** como **Root Directory**, **Vite** como framework, `npm run build` como Build Command e `dist` como Output Directory. Configure `VITE_API_URL` com a URL HTTPS da API terminando em `/api` antes do build. A hospedagem da API e do banco é separada. Na API, autorize o domínio do painel no CORS.

A API em `andora-back` e o painel anterior em `painel-visual` foram preservados. Esta pasta contém o painel administrativo enviado no arquivo; o site público permanece no repositório `LevyMatos0/Andora-vue`.
