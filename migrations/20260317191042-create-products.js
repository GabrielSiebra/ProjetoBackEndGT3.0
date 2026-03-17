'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('products', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true, // Chave primária auto-incrementada
      },
      enabled: {
        type: Sequelize.BOOLEAN,
        allowNull: true, // Preenchimento opcional
        defaultValue: false, // Valor padrão deve ser 0 (false)
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false, // Preenchimento obrigatório
      },
      slug: {
        type: Sequelize.STRING,
        allowNull: false, // Preenchimento obrigatório
      },
      use_in_menu: {
        type: Sequelize.BOOLEAN,
        allowNull: true, // Preenchimento opcional
        defaultValue: false, // Valor padrão deve ser 0
      },
      stock: {
        type: Sequelize.INTEGER,
        allowNull: true, // Preenchimento opcional
        defaultValue: 0, // Valor padrão deve ser 0
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true, // Preenchimento opcional
      },
      price: {
        type: Sequelize.FLOAT,
        allowNull: false, // Preenchimento obrigatório
      },
      price_with_discount: {
        type: Sequelize.FLOAT,
        allowNull: false, // Preenchimento obrigatório
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('products');
  }
};
