import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Importação de todas as rotas do sistema
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

// 1. Configuração do CORS (Segurança e comunicação com o Frontend)
app.use(cors({
  origin: [
    'http://localhost:5173',          // Frontend em ambiente de desenvolvimento (Vite)
    'https://levymatos0.github.io',   // Caso mantenha algo no GitHub Pages temporariamente
    'https://andora.com.br',          // O seu futuro domínio oficial
    'https://www.andora.com.br'
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true
}));

// 2. Middlewares de formatação
app.use(express.json()); // Permite que o Node.js compreenda JSON no corpo das requisições
app.use(express.urlencoded({ extended: true })); // Permite receber dados de formulários tradicionais

// 3. Ficheiros Estáticos (Torna a pasta 'uploads' pública para o frontend carregar as imagens)
// Sempre que o Vue pedir http://localhost:3000/uploads/imagem.jpg, o Express entrega o ficheiro
app.use('/uploads', express.static('uploads'));

// 4. Registo das Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/site', siteRoutes);
app.use('/api/servicos', servicoRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/mensagens', mensagemRoutes);
app.use('/api/users', userRoutes);
app.use('/api/perfil', perfilRoutes);

// 5. Middleware Global de Tratamento de Erros
// Captura qualquer "next(erro)" enviado pelos controllers para evitar que o servidor vá abaixo
app.use((err, req, res, next) => {
  console.error('Erro interno:', err);
  res.status(500).json({ 
    mensagem: 'Ocorreu um erro interno no servidor.',
    detalhe: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 6. Iniciar o Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor Backend a correr na porta ${PORT}`);
  console.log(`Pode testar em: http://localhost:${PORT}/api/dashboard`);
});
