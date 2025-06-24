const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Cart = sequelize.define('Cart', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'user_id'
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'product_id'
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1
      }
    }
  }, {
    tableName: 'Carts',
    underscored: true,
    timestamps: true,
    indexes: [
      { fields: ['user_id'] },
      { fields: ['product_id'] },
      { fields: ['user_id', 'product_id'], unique: true }
    ]
  });

  Cart.associate = (models) => {
    // Cart belongs to user
    Cart.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });

    // Cart belongs to product
    Cart.belongsTo(models.Product, {
      foreignKey: 'productId',
      as: 'product'
    });
  };

  return Cart;
};
