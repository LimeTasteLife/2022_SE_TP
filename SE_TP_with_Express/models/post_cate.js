const Sequelize = require('sequelize');

module.exports = class Post_cate extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {},
      {
        sequelize,
        timestamps: false,
        underscored: true,
        modelName: 'Post_cate',
        tableName: 'post_cate',
        paranoid: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    );
  }

  static associate(db) {
    Post_cate.belongsTo(db.Post);
    Post_cate.belongsTo(db.Category);
  }
};
