const Sequelize = require('sequelize');
const Rest_cate = require('./rest_cate');

module.exports = class Restaurant extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
          unique: true,
          primaryKey: true,
        },
        name: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        review_avg: {
          type: Sequelize.FLOAT,
          allowNull: true,
        },
        begin: {
          type: Sequelize.TIME,
          allowNull: false,
        },
        end: {
          type: Sequelize.TIME,
          allowNull: false,
        },
        min_order_amount: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
        },
        delivery_fee: {
          type: Sequelize.STRING(50),
          allowNull: false,
        },
        delivery_time: {
          type: Sequelize.STRING(50),
          allowNull: true,
        },
        phone: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        address: {
          type: Sequelize.STRING(150),
          allowNull: false,
        },
        url: {
          type: Sequelize.STRING(1000),
          allowNull: false,
        },
        lat: {
          type: Sequelize.FLOAT,
          allowNull: false,
        },
        lng: {
          type: Sequelize.FLOAT,
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: true,
        modelName: 'Restaurant',
        tableName: 'restaurant',
        paranoid: true,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    );
  }

  static associate(db) {
    db.Restaurant.hasMany(db.Menu, {
      foreignKey: 'restaurant_id',
      sourceKey: 'id',
    });
    db.Restaurant.belongsToMany(db.Category, { through: Rest_cate });
  }
};
