@echo off
setlocal
start "API Andora" cmd /k ""%~dp0andora-back\iniciar.cmd""
start "Painel Andora" cmd /k ""%~dp0painel-visual\iniciar.cmd""
echo Deixe as duas janelas abertas. Quando o Vite estiver pronto, abra http://localhost:5173
echo Se houver erro, leia a mensagem na janela correspondente.
pause
