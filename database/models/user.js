const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 100]
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'password_hash'
    },
    role: {
      type: DataTypes.ENUM('admin', 'customer'),
      allowNull: false,
      defaultValue: 'customer'
    }
  }, {
    tableName: 'Users',
    underscored: true,
    timestamps: true,
    indexes: [
      { fields: ['email'] },
      { fields: ['role'] }
    ]
  });

  User.associate = (models) => {
    // User has many carts
    User.hasMany(models.Cart, {
      foreignKey: 'userId',
      as: 'carts'
    });

    // User has many orders
    User.hasMany(models.Order, {
      foreignKey: 'userId',
      as: 'orders'
    });

    // User has many downloads
    User.hasMany(models.Download, {
      foreignKey: 'userId',
      as: 'downloads'
    });

    // User has many email notifications
    User.hasMany(models.EmailNotification, {
      foreignKey: 'userId',
      as: 'emailNotifications'
    });
  };

  return User;
};