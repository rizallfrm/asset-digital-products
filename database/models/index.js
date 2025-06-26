const { Sequelize } = require('sequelize');
const config = require('../../config/database');

const sequelize = new Sequelize(config.development);

const models = {
  User: require('./user')(sequelize),
  Category: require('./category')(sequelize),
  Product: require('./product')(sequelize),
  Cart: require('./cart')(sequelize),
  Order: require('./order')(sequelize),
  OrderItem: require('./orderitem')(sequelize),
  Payment: require('./payment')(sequelize),
  Download: require('./download')(sequelize),
  EmailNotification: require('./emailnotifications')(sequelize)
};

// Setup associations
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = {
  sequelize,
  ...models
};