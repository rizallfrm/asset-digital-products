const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Product = sequelize.define('Product', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'category_id'
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 200]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    previewImageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'preview_image_url'
    },
    driveFileId: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'drive_file_id'
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      allowNull: false,
      defaultValue: 'active'
    }
  }, {
    tableName: 'Products',
    underscored: true,
    timestamps: true,
    indexes: [
      { fields: ['category_id'] },
      { fields: ['status'] },
      { fields: ['name'] }
    ]
  });

  Product.associate = (models) => {
    // Product belongs to category
    Product.belongsTo(models.Category, {
      foreignKey: 'categoryId',
      as: 'category'
    });

    // Product has many cart items
    Product.hasMany(models.Cart, {
      foreignKey: 'productId',
      as: 'cartItems'
    });

    // Product has many order items
    Product.hasMany(models.OrderItem, {
      foreignKey: 'productId',
      as: 'orderItems'
    });

    // Product has many downloads
    Product.hasMany(models.Download, {
      foreignKey: 'productId',
      as: 'downloads'
    });
  };

  return Product;
};