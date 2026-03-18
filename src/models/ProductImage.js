const { Model, DataTypes } = require('sequelize');

class ProductImage extends Model {
  static init(sequelize) {
    super.init({
      product_id: DataTypes.INTEGER,
      enabled: { type: DataTypes.BOOLEAN, defaultValue: false },
      path: { type: DataTypes.STRING, allowNull: false }
    }, { sequelize, tableName: 'product_images', timestamps: false });
  }
}
module.exports = ProductImage;