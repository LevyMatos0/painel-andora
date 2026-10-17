import { pool } from '../config/database.js';

export const SiteService = {
  async buscarTodos() {
    const site = { hero: {}, sobre: {}, contato: {} };
    
    try {
      const [hero] = await pool.query('SELECT * FROM tb_hero LIMIT 1');
      if (hero.length > 0) {
        site.hero = { 
          titulo: hero[0].her_titulo, 
          titulo_ingles: hero[0].her_titulo_ingles,
          descricao: hero[0].her_descricao, 
          descricao_ingles: hero[0].her_descricao_ingles,
          imagem: hero[0].her_imagem 
        };
      }
      
      const [about] = await pool.query('SELECT * FROM tb_about LIMIT 1');
      if (about.length > 0) {
        site.sobre = { 
          titulo: about[0].abt_titulo, 
          titulo_ingles: about[0].abt_titulo_ingles,
          texto: about[0].abt_texto, 
          texto_ingles: about[0].abt_texto_ingles,
          imagem: about[0].abt_imagem 
        };
      }

      const [contato] = await pool.query('SELECT * FROM tb_contato LIMIT 1');
      if (contato.length > 0) {
        site.contato = { 
          endereco: contato[0].cto_endereco, 
          telefone: contato[0].cto_telefone, 
          email: contato[0].cto_email, 
          mapa: contato[0].cto_mapa 
        };
      }
    } catch (erro) {
      console.error('Erro ao buscar seções do site:', erro);
    }
    
    return site;
  },

  async salvarSecao(secao, dados) {
    if (secao === 'hero') {
      const [existe] = await pool.query('SELECT * FROM tb_hero LIMIT 1');
      
      if (existe.length === 0) {
        await pool.query(
          'INSERT INTO tb_hero (her_titulo, her_descricao, her_imagem) VALUES (?, ?, ?)', 
          [dados.titulo, dados.descricao, dados.imagem || null]
        );
      } else {
        let sql = 'UPDATE tb_hero SET her_titulo = ?, her_descricao = ?';
        const params = [dados.titulo, dados.descricao];
        
        if (dados.imagem) {
          sql += ', her_imagem = ?';
          params.push(dados.imagem);
        }
        await pool.query(sql, params);
      }

    } else if (secao === 'sobre') {
      const [existe] = await pool.query('SELECT * FROM tb_about LIMIT 1');
      
      if (existe.length === 0) {
        await pool.query(
          'INSERT INTO tb_about (abt_titulo, abt_texto, abt_imagem) VALUES (?, ?, ?)', 
          [dados.titulo, dados.texto, dados.imagem || null]
        );
      } else {
        let sql = 'UPDATE tb_about SET abt_titulo = ?, abt_texto = ?';
        const params = [dados.titulo, dados.texto];
        
        if (dados.imagem) {
          sql += ', abt_imagem = ?';
          params.push(dados.imagem);
        }
        await pool.query(sql, params);
      }

    } else if (secao === 'contato') {
      const [existe] = await pool.query('SELECT * FROM tb_contato LIMIT 1');
      
      if (existe.length === 0) {
        await pool.query(
          'INSERT INTO tb_contato (cto_endereco, cto_telefone, cto_email, cto_mapa) VALUES (?, ?, ?, ?)', 
          [dados.endereco, dados.telefone, dados.email, dados.mapa]
        );
      } else {
        await pool.query(
          'UPDATE tb_contato SET cto_endereco = ?, cto_telefone = ?, cto_email = ?, cto_mapa = ?', 
          [dados.endereco, dados.telefone, dados.email, dados.mapa]
        );
      }
    }
  }
};
