'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('product_category', {
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false, // Preenchimento obrigatório
        references: {
          model: 'products', // Referência à tabela de produtos
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      category_id: {
        type: Sequelize.INTEGER,
        allowNull: false, // Preenchimento obrigatório
        references: {
          model: 'categories', // Referência à tabela de categorias
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('product_category');
  }
};
