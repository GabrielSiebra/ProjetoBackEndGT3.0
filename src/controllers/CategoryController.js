const Category = require('../models/Category');

class CategoryController {
  // Requisito 01 - Listar categorias com filtros
  async search(req, res) {
    try {
      let { limit = 12, page = 1, fields, use_in_menu } = req.query;
      
      limit = parseInt(limit);
      page = parseInt(page);
      const offset = limit === -1 ? 0 : (page - 1) * limit; // Lógica de paginação

      const where = {};
      if (use_in_menu !== undefined) {
        where.use_in_menu = use_in_menu === 'true'; // Filtro use_in_menu
      }

      const attributes = fields ? fields.split(',') : undefined; // Seleção de campos

      const { count, rows } = await Category.findAndCountAll({
        where,
        attributes,
        limit: limit === -1 ? undefined : limit,
        offset: limit === -1 ? undefined : offset,
      });

      return res.status(200).json({
        data: rows,
        total: count,
        limit,
        page
      });
    } catch (error) {
      return res.status(400).json({ error: 'Erro na busca' }); // Status 400
    }
  }
  async getById(req, res) {
    try {
      const category = await Category.findByPk(req.params.id);
      if (!category) return res.status(404).json({ error: 'Não encontrado' }); // Status 404
      return res.status(200).json(category);
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao buscar' });
    }
  }
  async create(req, res) {
    try {
      const category = await Category.create(req.body);
      return res.status(201).json(category); // Status 201 Created
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao criar' });
    }
  }
  async update(req, res) {
    try {
      const category = await Category.findByPk(req.params.id);
      if (!category) return res.status(404).json({ error: 'Não encontrado' });
      await category.update(req.body);
      return res.status(204).send(); // Status 204 No Content
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao atualizar' });
    }
  }
  async delete(req, res) {
    try {
      const category = await Category.findByPk(req.params.id);
      if (!category) return res.status(404).json({ error: 'Não encontrado' });
      await category.destroy();
      return res.status(204).send(); // Status 204 No Content
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao deletar' });
    }
  }
}

module.exports = new CategoryController();