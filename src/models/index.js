const Sequelize = require('sequelize');
const dbConfig = require('../config/database');

const User = require('./User');

const connection = new Sequelize(dbConfig);

User.init(connection); // Inicializando o Model

module.exports = connection;