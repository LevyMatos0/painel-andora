@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Instale o Node.js 24 LTS de https://nodejs.org e tente novamente.
  pause
  exit /b 1
)
if not exist node_modules (
  call npm ci
  if errorlevel 1 (
    echo A instalacao falhou. Confira sua conexao e a mensagem acima.
    pause
    exit /b 1
  )
)
echo Abra no navegador o endereco exibido pelo Vite. Mantenha a API aberta tambem.
call npm run dev
if errorlevel 1 (
  echo Confira se outro painel ja esta aberto na porta 5173 e leia a mensagem acima.
  pause
  exit /b 1
)
