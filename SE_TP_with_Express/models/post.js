const Sequelize = require('sequelize');
const Post_cate = require('./post_cate');
const User_post = require('./user_post');

module.exports = class Post extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        restaurant_id: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
        },
        title: {
          type: Sequelize.STRING(100),
          allowNull: false,
          unique: false,
        },
        mem_count: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
        },
        cur_mem: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
          defaultValue: 0,
        },
        lat: {
          type: Sequelize.FLOAT,
          allowNull: false,
        },
        long: {
          type: Sequelize.FLOAT,
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: true,
        modelName: 'Post',
        tableName: 'post',
        paranoid: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    );
  }

  static associate(db) {
    db.Post.hasOne(db.Post_content, { foreignKey: 'post_id', sourceKey: 'id' });
    db.Post.hasMany(db.Comment);
    db.Post.belongsToMany(db.User, { through: User_post });
    db.Post.belongsToMany(db.Category, { through: Post_cate });
  }
};
