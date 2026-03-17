'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('product_images', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true, // Chave primária
      },
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false, // É obrigatório saber de qual produto é a imagem
        references: {
          model: 'products', // Nome da tabela que estamos referenciando
          key: 'id', // Nome da coluna na tabela referenciada
        },
        onUpdate: 'CASCADE', // Se o ID do produto mudar, atualiza aqui também
        onDelete: 'CASCADE', // Se o produto for deletado, suas imagens também serão
      },
      enabled: {
        type: Sequelize.BOOLEAN,
        allowNull: true, // Preenchimento opcional
        defaultValue: false, // Valor padrão deve ser 0 (false)
      },
      path: {
        type: Sequelize.STRING,
        allowNull: false, // Preenchimento obrigatório e caminho relativo
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('product_images');
  }
};
