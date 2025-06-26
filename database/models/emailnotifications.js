const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const EmailNotification = sequelize.define('EmailNotification', {
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
    orderId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'order_id'
    },
    emailTo: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'email_to',
      validate: {
        isEmail: true
      }
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    status: {
      type: DataTypes.ENUM('pending', 'sent', 'failed'),
      allowNull: false,
      defaultValue: 'pending'
    },
    errorMessage: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'error_message'
    },
    sentAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'sent_at'
    }
  }, {
    tableName: 'EmailNotifications',
    underscored: true,
    timestamps: true,
    indexes: [
      { fields: ['user_id'] },
      { fields: ['order_id'] },
      { fields: ['status'] },
      { fields: ['email_to'] }
    ]
  });

  EmailNotification.associate = (models) => {
    // EmailNotification belongs to user
    EmailNotification.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });

    // EmailNotification belongs to order
    EmailNotification.belongsTo(models.Order, {
      foreignKey: 'orderId',
      as: 'order'
    });
  };

  return EmailNotification;
};
