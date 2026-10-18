import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// 1. Importação de todas as rotas do sistema
import authRoutes from './routes/auth.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import siteRoutes from './routes/site.routes.js';
import servicoRoutes from './routes/servico.routes.js';
import teamRoutes from './routes/team.routes.js';
import faqRoutes from './routes/faq.routes.js';
import mensagemRoutes from './routes/mensagem.routes.js';
import userRoutes from './routes/user.routes.js';
import perfilRoutes from './routes/perfil.routes.js';

// Carrega as variáveis de ambiente do ficheiro .env
dotenv.config();

const app = express();

// 2. Configuração do CORS (Segurança e comunicação com o Frontend)
app.use(cors({
  origin: [
    'http://localhost:5173',          // Frontend em ambiente de desenvolvimento (Vite)
    'https://levymatos0.github.io',   // O seu site atual no GitHub Pages
    'https://andora.com.br',          // O seu futuro domínio oficial
    'https://www.andora.com.br'
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true
}));

// 3. Middlewares de formatação (para ler JSON enviado pelo Vue)
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// 4. Ficheiros Estáticos
// Permite que o frontend aceda às imagens guardadas na pasta 'uploads'
app.use('/uploads', express.static('uploads'));

// 5. Registo das Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/site', siteRoutes);
app.use('/api/servicos', servicoRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/mensagens', mensagemRoutes);
app.use('/api/users', userRoutes);
app.use('/api/perfil', perfilRoutes);

// 6. Middleware Global de Tratamento de Erros
// Evita que o servidor vá abaixo caso ocorra um erro não tratado num controller
app.use((err, req, res, next) => {
  console.error('Erro interno detetado:', err);
  res.status(500).json({ 
    mensagem: 'Ocorreu um erro interno no servidor.',
    // Só envia os detalhes técnicos do erro se estiver no ambiente de desenvolvimento
    detalhe: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 7. Iniciar o Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor Backend a correr na porta ${PORT}`);
  console.log(`🌐 Teste a API em: http://localhost:${PORT}/api/servicos`);
});
