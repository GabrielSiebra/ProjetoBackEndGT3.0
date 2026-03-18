const { Model, DataTypes } = require('sequelize');

class ProductOption extends Model {
  static init(sequelize) {
    super.init({
      product_id: DataTypes.INTEGER,
      title: { type: DataTypes.STRING, allowNull: false },
      shape: { type: DataTypes.ENUM('square', 'circle'), defaultValue: 'square' },
      radius: { type: DataTypes.INTEGER, defaultValue: 0 },
      type: { type: DataTypes.ENUM('text', 'color'), defaultValue: 'text' },
      values: { type: DataTypes.STRING, allowNull: false }
    }, { sequelize, tableName: 'product_options', timestamps: false });
  }
}
module.exports = ProductOption;