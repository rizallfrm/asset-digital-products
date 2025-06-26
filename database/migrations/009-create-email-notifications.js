'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('EmailNotifications', {
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
        onDelete: 'CASCADE'
      },
      orderId: {
        type: Sequelize.UUID,
        allowNull: true,
        field: 'order_id',
        references: {
          model: 'Orders',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      emailTo: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'email_to'
      },
      subject: {
        type: Sequelize.STRING,
        allowNull: false
      },
      body: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('pending', 'sent', 'failed'),
        allowNull: false,
        defaultValue: 'pending'
      },
      errorMessage: {
        type: Sequelize.TEXT,
        allowNull: true,
        field: 'error_message'
      },
      sentAt: {
        type: Sequelize.DATE,
        allowNull: true,
        field: 'sent_at'
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
    await queryInterface.addIndex('EmailNotifications', ['user_id']);
    await queryInterface.addIndex('EmailNotifications', ['order_id']);
    await queryInterface.addIndex('EmailNotifications', ['status']);
    await queryInterface.addIndex('EmailNotifications', ['email_to']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('EmailNotifications');
  }
};