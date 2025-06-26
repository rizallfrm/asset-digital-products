'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Payments', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      orderId: {
        type: Sequelize.UUID,
        allowNull: false,
        field: 'order_id',
        references: {
          model: 'Orders',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      midtransTransactionId: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        field: 'midtrans_transaction_id'
      },
      paymentType: {
        type: Sequelize.STRING,
        allowNull: true,
        field: 'payment_type'
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('pending', 'settlement', 'capture', 'deny', 'cancel', 'expire', 'failure'),
        allowNull: false,
        defaultValue: 'pending'
      },
      midtransResponse: {
        type: Sequelize.TEXT,
        allowNull: true,
        field: 'midtrans_response'
      },
      transactionTime: {
        type: Sequelize.DATE,
        allowNull: true,
        field: 'transaction_time'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        field: 'created_at'
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        field: 'updated_at'
      }
    });

    // Add indexes
    await queryInterface.addIndex('Payments', ['order_id']);
    await queryInterface.addIndex('Payments', ['midtrans_transaction_id']);
    await queryInterface.addIndex('Payments', ['status']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Payments');
  }
};
