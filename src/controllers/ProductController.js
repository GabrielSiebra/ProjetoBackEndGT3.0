const { Op } = require('sequelize');
const Product = require('../models/Product');
const ProductImage = require('../models/ProductImage');
const ProductOption = require('../models/ProductOption');

class ProductController {
  async create(req, res) {
    try {
      const { images, options, category_ids, ...productData } = req.body;

      // Cria o produto base
      const product = await Product.create(productData);

      // Vincula Categorias
      if (category_ids && category_ids.length > 0) {
        await product.setCategories(category_ids);
      }

      // Cria Imagens vinculadas
      if (images && images.length > 0) {
        const imagesWithId = images.map(img => ({ ...img, product_id: product.id, path: img.content }));
        await ProductImage.bulkCreate(imagesWithId);
      }

      // Cria Opções vinculadas
      if (options && options.length > 0) {
        const optionsWithId = options.map(opt => ({ 
          ...opt, 
          product_id: product.id,
          values: opt.values ? opt.values.join(',') : opt.value.join(',') 
        }));
        await ProductOption.bulkCreate(optionsWithId);
      }

      return res.status(201).json({ message: "Produto criado com sucesso", id: product.id });
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao criar produto', message: error.message });
    }
  }
  async search(req, res) {
    try {
      let { 
        limit = 12, 
        page = 1, 
        fields, 
        match, 
        category_ids, 
        'price-range': priceRange 
      } = req.query;

      const where = {};

      // Filtro por termo (nome ou descrição)
      if (match) {
        where[Op.or] = [
          { name: { [Op.like]: `%${match}%` } },
          { description: { [Op.like]: `%${match}%` } }
        ];
      }

      // Filtro por faixa de preço
      if (priceRange) {
        const [min, max] = priceRange.split('-').map(Number);
        where.price = { [Op.between]: [min, max] };
      }

      // Configuração de paginação
      limit = parseInt(limit);
      const offset = limit === -1 ? 0 : (parseInt(page) - 1) * limit;

      const include = [
        { model: ProductImage, as: 'images', attributes: ['id', 'path'] },
        { 
          model: Category, 
          as: 'categories', 
          attributes: ['id'],
          where: category_ids ? { id: category_ids.split(',') } : undefined 
        }
      ];

      const { count, rows } = await Product.findAndCountAll({
        where,
        include,
        attributes: fields ? fields.split(',') : undefined,
        limit: limit === -1 ? undefined : limit,
        offset: limit === -1 ? undefined : offset,
        distinct: true // Evita contagem duplicada devido aos joins
      });

      return res.status(200).json({
        data: rows,
        total: count,
        limit,
        page: parseInt(page)
      });
    } catch (error) {
      return res.status(400).json({ error: 'Erro na busca de produtos', details: error.message });
    }
  }
  async getById(req, res) {
    try {
      const product = await Product.findByPk(req.params.id, {
        include: [
          { model: ProductImage, as: 'images' },
          { model: Category, as: 'categories', through: { attributes: [] } }
        ]
      });

      if (!product) return res.status(404).json({ error: 'Produto não encontrado' });
      
      return res.status(200).json(product);
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao buscar produto' });
    }
  }
  async update(req, res) {
    try {
      const { id } = req.params;
      const { images, options, category_ids, ...productData } = req.body;

      const product = await Product.findByPk(id);
      if (!product) return res.status(404).json({ error: 'Produto não encontrado' });

      await product.update(productData);

      if (category_ids) await product.setCategories(category_ids);

      if (images && images.length > 0) {
        for (const img of images) {
          if (img.id && img.deleted) {
            await ProductImage.destroy({ where: { id: img.id } });
          } else if (img.id) {
            await ProductImage.update(img, { where: { id: img.id } });
          } else {
            await ProductImage.create({ ...img, product_id: id, path: img.content });
          }
        }
      }
      if (options && options.length > 0) {
        for (const opt of options) {
          if (opt.id && opt.deleted) {
            await ProductOption.destroy({ where: { id: opt.id } });
          } else if (opt.id) {
            const formattedOpt = { ...opt };
            if (opt.values) formattedOpt.values = opt.values.join(',');
            await ProductOption.update(formattedOpt, { where: { id: opt.id } });
          } else {
            const values = opt.values ? opt.values.join(',') : opt.value.join(',');
            await ProductOption.create({ ...opt, product_id: id, values });
          }
        }
      }

      return res.status(204).send(); // Status 204 No Content
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao atualizar produto', message: error.message });
    }
  }
  async delete(req, res) {
    try {
      const product = await Product.findByPk(req.params.id);
      if (!product) return res.status(404).json({ error: 'Produto não encontrado' });

      // O Sequelize cuidará das imagens/opções se o ON DELETE CASCADE estiver na Migration
      await product.destroy();

      return res.status(204).send(); // Status 204 No Content
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao deletar produto' });
    }
  }
}

module.exports = new ProductController();