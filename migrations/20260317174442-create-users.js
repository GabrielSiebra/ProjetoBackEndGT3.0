'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true, // Chave primária incrementada automaticamente
      },
      firstname: {
        type: Sequelize.STRING,
        allowNull: false, // Preenchimento obrigatório
      },
      surname: {
        type: Sequelize.STRING,
        allowNull: false, // Preenchimento obrigatório
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false, // Preenchimento obrigatório
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false, // Hash do bcrypt
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
    await queryInterface.dropTable('users');
  }
};
