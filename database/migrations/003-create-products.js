'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Products', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      categoryId: {
        type: Sequelize.UUID,
        allowNull: false,
        field: 'category_id',
        references: {
          model: 'Categories',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      stock: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      previewImageUrl: {
        type: Sequelize.STRING,
        allowNull: true,
        field: 'preview_image_url'
      },
      driveFileId: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'drive_file_id'
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive'),
        allowNull: false,
        defaultValue: 'active'
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
    await queryInterface.addIndex('Products', ['category_id']);
    await queryInterface.addIndex('Products', ['status']);
    await queryInterface.addIndex('Products', ['name']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Products');
  }
};