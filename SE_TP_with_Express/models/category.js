const Sequelize = require('sequelize');
const Rest_cate = require('./rest_cate');
const Post_cate = require('./post_cate');

module.exports = class Category extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        name: {
          type: Sequelize.STRING(50),
          allowNull: false,
          unique: true,
        },
      },
      {
        sequelize,
        timestamps: false,
        underscored: true,
        modelName: 'Category',
        tableName: 'category',
        paranoid: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    );
  }

  static associate(db) {
    db.Category.belongsToMany(db.Restaurant, { through: Rest_cate });
    db.Category.belongsToMany(db.Post, { through: Post_cate });
  }
};
