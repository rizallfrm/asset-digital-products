'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Downloads', {
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
      productId: {
        type: Sequelize.UUID,
        allowNull: false,
        field: 'product_id',
        references: {
          model: 'Products',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
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
      downloadToken: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        field: 'download_token'
      },
      downloadCount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'download_count'
      },
      maxDownloads: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 3,
        field: 'max_downloads'
      },
      expiresAt: {
        type: Sequelize.DATE,
        allowNull: false,
        field: 'expires_at'
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
    await queryInterface.addIndex('Downloads', ['user_id']);
    await queryInterface.addIndex('Downloads', ['product_id']);
    await queryInterface.addIndex('Downloads', ['order_id']);
    await queryInterface.addIndex('Downloads', ['download_token']);
    await queryInterface.addIndex('Downloads', ['expires_at']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Downloads');
  }
};
