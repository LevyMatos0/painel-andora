import { pool } from '../config/database.js';

const sections = {
  hero: {
    table: 'tb_hero', id: 'her_codigo', image: 'her_imagem',
    fields: { titulo: 'her_titulo', descricao: 'her_descricao' },
    translations: { titulo_ingles: 'her_titulo_ingles', descricao_ingles: 'her_descricao_ingles' },
  },
  sobre: {
    table: 'tb_about', id: 'abt_codigo', image: 'abt_imagem',
    fields: { titulo: 'abt_titulo', texto: 'abt_texto' },
    translations: { titulo_ingles: 'abt_titulo_ingles', texto_ingles: 'abt_texto_ingles' },
  },
};

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
    if (secao === 'hero' || secao === 'sobre') {
      const config = sections[secao];
      const [existe] = await pool.query(`SELECT * FROM ${config.table} LIMIT 1`);
      const values = Object.fromEntries(
        Object.entries(config.fields).map(([field, column]) => [column, dados[field]])
      );

      // Missing translations must not erase values saved by another panel version.
      // Accept public API names as well as the exact column names from the SQL.
      for (const [field, column] of Object.entries(config.translations)) {
        const key = Object.hasOwn(dados, field) ? field : column;
        if (Object.hasOwn(dados, key) && dados[key] !== undefined) values[column] = dados[key];
      }

      if (existe.length === 0 || dados.imagem) values[config.image] = dados.imagem || null;
      const columns = Object.keys(values);
      const params = Object.values(values);

      if (existe.length === 0) {
        await pool.query(
          `INSERT INTO ${config.table} (${columns.join(', ')}) VALUES (${columns.map(() => '?').join(', ')})`,
          params
        );
      } else {
        await pool.query(
          `UPDATE ${config.table} SET ${columns.map(column => `${column} = ?`).join(', ')} WHERE ${config.id} = ?`,
          [...params, existe[0][config.id]]
        );
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
