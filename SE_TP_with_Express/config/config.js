require('dotenv').config();

module.exports = {
  development: {
    username: process.env.SEQUELIZE_USERNAME,
    password: process.env.SEQUELIZE_PASSWORD,
    database: 'DeliTo_development',
    host: '127.0.0.1',
    dialect: 'mysql',
    //logging: false,
  },
  test: {
    username: 'root',
    password: null,
    database: 'DeliTo_test',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
  production: {
    username: 'root',
    password: null,
    database: 'DeliTo_production',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
};
