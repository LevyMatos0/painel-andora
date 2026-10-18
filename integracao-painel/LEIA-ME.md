# Correção da sidebar enviada no chat

O arquivo `Sidebar.vue` desta pasta é a versão corrigida do componente fornecido pelo usuário. Ele é um arquivo para substituir no painel existente; esta pasta não é um novo aplicativo e não deve ser executada com `npm run dev`.

## Instalação no Windows

1. Baixe o ZIP da branch https://github.com/LevyMatos0/painel-andora/tree/codex/integracao-idiomas-site em **Code → Download ZIP** e extraia em outra pasta.
2. No projeto do **painel**, substitua seu `src/components/Sidebar.vue` por `integracao-painel/Sidebar.vue` deste ZIP. Mantenha o arquivo em uma pasta onde o import `../services/api` aponte para o mesmo serviço usado pelo componente original. Preserve seu `src/services/api` e as outras telas.
3. Na **API atual**, copie estes arquivos do ZIP para as mesmas localizações:

   - `andora-back/src/server.js`
   - `andora-back/src/app.js`
   - `andora-back/src/controllers/user.controller.js`
   - `andora-back/src/services/user.service.js`
   - `andora-back/src/services/auth.service.js`
   - `andora-back/src/routes/perfil.routes.js` (**arquivo novo**)

4. Preserve o `.env`, a pasta `uploads`, o banco e as correções anteriores de Hero/About/FAQ. Não é necessário importar SQL.
5. Pare a API com Ctrl+C e inicie novamente com `node src/server.js` dentro de `andora-back`.
6. Reinicie o frontend do painel, faça login novamente e confira nome, cargo e foto no rodapé da sidebar. O painel continua na porta 5173; o site público continua em 5174.

Não copie a sidebar para o projeto do site público `Andora-vue`. O componente é do painel administrativo fornecido no chat.

## O que foi corrigido

- A API disponibiliza `GET /api/perfil`, protegido pelo token de login. O usuário é escolhido exclusivamente pelo ID do token, sem usar um ID enviado no endereço.
- A resposta contém os nomes públicos `nome`, `cargo`, `cargo_ingles`, `foto` etc. e os aliases `usr_nome`, `usr_cargo`, `usr_cargo_ingles`, `usr_foto` etc., para manter compatibilidade com a sidebar anterior. Não inclui senha nem hash.
- A sidebar chama `apiRequest('/perfil')`, como antes. O serviço existente do painel deve usar a raiz `/api` e enviar `Authorization: Bearer <token>`.
- O evento `window.dispatchEvent(new Event('perfilAtualizado'))` continua recarregando os dados após salvar no painel.
- A foto usa um elemento `img`, com corte circular e retorno às iniciais em caso de erro. A URL só recebe uma nova versão após carregar o perfil; alternar idioma ou renderizar o componente não força outro download.
- Quando a consulta falha, a sidebar não inventa nome ou cargo de Administrador. Na primeira falha, exibe “Perfil indisponível” e um botão para tentar novamente; após uma consulta anterior bem-sucedida, preserva o último perfil enquanto permite repetir a consulta.

## Endereço da foto e idioma

O endereço da API para a foto usa `VITE_API_BASE_URL`, ou `VITE_API_URL` se já for usado pelo painel. Sem configuração, mantém o padrão local `http://localhost:3000`. Reinicie o frontend após alterar variáveis do Vite.

Também é possível passar a raiz da API como propriedade, por exemplo `<Sidebar api-base-url="http://localhost:3000" />`. URLs absolutas HTTP/HTTPS de fotos também são aceitas. O valor relativo retornado pela API aponta para `/uploads/`.

Se o painel já tem vue-i18n com a propriedade global `$i18n.locale`, a sidebar acompanha o idioma. Em EN, usa `cargo_ingles` quando preenchido; caso contrário, mantém `cargo`. Sem vue-i18n, permanece em português. Um painel com outro controle de idioma pode passar `<Sidebar :locale="idioma" />`. O componente não exige instalar uma biblioteca nova.

## Validação

A rota foi testada contra MySQL temporário e autenticação real. O componente foi compilado e exercitado em um aplicativo Vue temporário com o mesmo serviço de API esperado pelo código fornecido. Foram verificados nome/cargo/foto, troca de idioma, evento de atualização, foto ausente e recuperação após falha. Não foi possível executar o restante do painel, pois apenas o componente da sidebar foi fornecido.
