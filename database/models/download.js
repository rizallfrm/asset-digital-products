const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Download = sequelize.define('Download', {
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
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'product_id'
    },
    orderId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'order_id'
    },
    downloadToken: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: 'download_token'
    },
    downloadCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'download_count',
      validate: {
        min: 0
      }
    },
    maxDownloads: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 3,
      field: 'max_downloads',
      validate: {
        min: 1
      }
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'expires_at'
    }
  }, {
    tableName: 'Downloads',
    underscored: true,
    timestamps: true,
    indexes: [
      { fields: ['user_id'] },
      { fields: ['product_id'] },
      { fields: ['order_id'] },
      { fields: ['download_token'] },
      { fields: ['expires_at'] }
    ]
  });

  Download.associate = (models) => {
    // Download belongs to user
    Download.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });

    // Download belongs to product
    Download.belongsTo(models.Product, {
      foreignKey: 'productId',
      as: 'product'
    });

    // Download belongs to order
    Download.belongsTo(models.Order, {
      foreignKey: 'orderId',
      as: 'order'
    });
  };

  return Download;
};