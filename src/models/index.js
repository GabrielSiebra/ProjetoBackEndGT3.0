const Sequelize = require('sequelize');
const dbConfig = require('../config/database');

const User = require('./User');
const Category = require('./Category');
const Product = require('./Product');
const ProductImage = require('./ProductImage');
const ProductOption = require('./ProductOption');

const connection = new Sequelize(dbConfig);

User.init(connection);
Category.init(connection);
Product.init(connection);
ProductImage.init(connection);
ProductOption.init(connection);

Product.associate(connection.models);


module.exports = connection;