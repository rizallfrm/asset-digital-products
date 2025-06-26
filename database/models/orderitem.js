const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const OrderItem = sequelize.define('OrderItem', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    orderId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'order_id'
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'product_id'
    },
    productName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'product_name'
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1
      }
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    }
  }, {
    tableName: 'OrderItems',
    underscored: true,
    timestamps: true,
    indexes: [
      { fields: ['order_id'] },
      { fields: ['product_id'] }
    ]
  });

  OrderItem.associate = (models) => {
    // OrderItem belongs to order
    OrderItem.belongsTo(models.Order, {
      foreignKey: 'orderId',
      as: 'order'
    });

    // OrderItem belongs to product
    OrderItem.belongsTo(models.Product, {
      foreignKey: 'productId',
      as: 'product'
    });
  };

  return OrderItem;
};
