import { pool } from './src/config/database.js';
import bcrypt from 'bcryptjs';

async function criar() {
  try {
    const senhaHash = await bcrypt.hash('admin123', 10);
    
    // Apaga se já existir
    await pool.query("DELETE FROM tb_user WHERE usr_email = 'admin@andora.com'");

    // Insere com o hash gerado pela própria biblioteca instalada na sua máquina
    await pool.query(`
      INSERT INTO tb_user (usr_nome, usr_email, usr_senha, usr_cargo, usr_telefone)
      VALUES (?, ?, ?, ?, ?)
    `, ['Administrador', 'admin@andora.com', senhaHash, 'Admin', '11999999999']);

    console.log('✅ Utilizador admin criado com sucesso!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Erro ao criar:', err);
    process.exit(1);
  }
}

criar();