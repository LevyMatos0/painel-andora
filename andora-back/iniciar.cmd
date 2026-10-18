@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Instale o Node.js 24 LTS de https://nodejs.org e tente novamente.
  pause
  exit /b 1
)
if not exist .env (
  copy .env.example .env >nul
  echo Configure o .env com seu banco existente, salve e execute o iniciador novamente.
  notepad .env
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
node src/server.js
if errorlevel 1 (
  echo Confira a configuracao do banco e se a porta da API ja esta ocupada.
  pause
  exit /b 1
)
