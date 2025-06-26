'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Orders', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        field: 'user_id',
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      orderNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        field: 'order_number'
      },
      totalAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        field: 'total_amount'
      },
      status: {
        type: Sequelize.ENUM('pending', 'paid', 'cancelled', 'completed'),
        allowNull: false,
        defaultValue: 'pending'
      },
      midtransOrderId: {
        type: Sequelize.STRING,
        allowNull: true,
        field: 'midtrans_order_id'
      },
      midtransTransactionId: {
        type: Sequelize.STRING,
        allowNull: true,
        field: 'midtrans_transaction_id'
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
    await queryInterface.addIndex('Orders', ['user_id']);
    await queryInterface.addIndex('Orders', ['order_number']);
    await queryInterface.addIndex('Orders', ['status']);
    await queryInterface.addIndex('Orders', ['midtrans_transaction_id']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Orders');
  }
};