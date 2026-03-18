const { Model, DataTypes } = require('sequelize');

class Product extends Model {
  static init(sequelize) {
    super.init({
      enabled: { type: DataTypes.BOOLEAN, defaultValue: false },
      name: { type: DataTypes.STRING, allowNull: false },
      slug: { type: DataTypes.STRING, allowNull: false },
      use_in_menu: { type: DataTypes.BOOLEAN, defaultValue: false },
      stock: { type: DataTypes.INTEGER, defaultValue: 0 },
      description: DataTypes.STRING,
      price: { type: DataTypes.FLOAT, allowNull: false },
      price_with_discount: { type: DataTypes.FLOAT, allowNull: false }
    }, { sequelize, tableName: 'products' });
  }

  static associate(models) {
    this.hasMany(models.ProductImage, { foreignKey: 'product_id', as: 'images' });
    this.hasMany(models.ProductOption, { foreignKey: 'product_id', as: 'options' });
    this.belongsToMany(models.Category, { 
      through: 'product_category', 
      foreignKey: 'product_id', 
      as: 'categories' 
    });
  }
}
module.exports = Product;