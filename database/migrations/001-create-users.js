'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      passwordHash: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'password_hash'
      },
      role: {
        type: Sequelize.ENUM('admin', 'customer'),
        allowNull: false,
        defaultValue: 'customer'
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
    await queryInterface.addIndex('Users', ['email']);
    await queryInterface.addIndex('Users', ['role']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};
