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
