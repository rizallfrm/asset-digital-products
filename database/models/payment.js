const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Payment = sequelize.define('Payment', {
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
    midtransTransactionId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: 'midtrans_transaction_id'
    },
    paymentType: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'payment_type'
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    status: {
      type: DataTypes.ENUM('pending', 'settlement', 'capture', 'deny', 'cancel', 'expire', 'failure'),
      allowNull: false,
      defaultValue: 'pending'
    },
    midtransResponse: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'midtrans_response'
    },
    transactionTime: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'transaction_time'
    }
  }, {
    tableName: 'Payments',
    underscored: true,
    timestamps: true,
    indexes: [
      { fields: ['order_id'] },
      { fields: ['midtrans_transaction_id'] },
      { fields: ['status'] }
    ]
  });

  Payment.associate = (models) => {
    // Payment belongs to order
    Payment.belongsTo(models.Order, {
      foreignKey: 'orderId',
      as: 'order'
    });
  };

  return Payment;
};
