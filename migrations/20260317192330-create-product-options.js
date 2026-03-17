'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('product_options', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true, // Chave primária
      },
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false, // Preenchimento obrigatório e chave estrangeira
        references: {
          model: 'products',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false, // Preenchimento obrigatório
      },
      shape: {
        type: Sequelize.ENUM('square', 'circle'), // Aceita apenas square ou circle
        allowNull: true, // Preenchimento opcional
        defaultValue: 'square', // Valor padrão deve ser square
      },
      radius: {
        type: Sequelize.INTEGER,
        allowNull: true, // Preenchimento opcional
        defaultValue: 0, // Valor padrão deve ser 0
      },
      type: {
        type: Sequelize.ENUM('text', 'color'), // Aceita apenas text ou color
        allowNull: true, // Preenchimento opcional
        defaultValue: 'text', // Valor padrão deve ser text
      },
      values: {
        type: Sequelize.STRING,
        allowNull: false, // Preenchimento obrigatório
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('product_options');
  }
};
