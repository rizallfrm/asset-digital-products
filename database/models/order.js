const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Order = sequelize.define('Order', {
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
    orderNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: 'order_number'
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'total_amount',
      validate: {
        min: 0
      }
    },
    status: {
      type: DataTypes.ENUM('pending', 'paid', 'cancelled', 'completed'),
      allowNull: false,
      defaultValue: 'pending'
    },
    midtransOrderId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'midtrans_order_id'
    },
    midtransTransactionId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'midtrans_transaction_id'
    }
  }, {
    tableName: 'Orders',
    underscored: true,
    timestamps: true,
    indexes: [
      { fields: ['user_id'] },
      { fields: ['order_number'] },
      { fields: ['status'] },
      { fields: ['midtrans_transaction_id'] }
    ]
  });

  Order.associate = (models) => {
    // Order belongs to user
    Order.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });

    // Order has many order items
    Order.hasMany(models.OrderItem, {
      foreignKey: 'orderId',
      as: 'orderItems'
    });

    // Order has one payment
    Order.hasOne(models.Payment, {
      foreignKey: 'orderId',
      as: 'payment'
    });

    // Order has many downloads
    Order.hasMany(models.Download, {
      foreignKey: 'orderId',
      as: 'downloads'
    });

    // Order has many email notifications
    Order.hasMany(models.EmailNotification, {
      foreignKey: 'orderId',
      as: 'emailNotifications'
    });
  };

  return Order;
};