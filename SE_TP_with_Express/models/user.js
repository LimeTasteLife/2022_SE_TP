const Sequelize = require('sequelize');
const User_post = require('./user_post');

module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        account: {
          type: Sequelize.STRING(40),
          allowNull: false,
          unique: true,
        },
        password: {
          type: Sequelize.STRING(100), // 암호화한 결과값 생각.
          allowNull: false,
        },
        name: {
          type: Sequelize.STRING(20), // 20byte 제한.
          allowNull: false,
        },
        email: {
          type: Sequelize.STRING(50),
          allowNull: false,
          unique: true,
        },
        point: {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: '0',
        },
        img_url: {
          type: Sequelize.STRING(1000),
          allowNull: true,
        },
        manner: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: '0',
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: true,
        modelName: 'User',
        tableName: 'user',
        paranoid: true,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    );
  }

  static associate(db) {
    db.User.hasMany(db.Report);
    db.User.hasMany(db.Transaction);
    db.User.belongsToMany(db.Post, { through: User_post });
  }
};
