const Sequelize = require('sequelize');

module.exports = class User_post extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {},
      {
        sequelize,
        timestamps: false,
        underscored: true,
        modelName: 'Rest_cate',
        tableName: 'rest_cate',
        paranoid: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    );
  }

  static associate(db) {
    User_post.belongsTo(db.User);
    User_post.belongsTo(db.Post);
  }
};
