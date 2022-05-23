const Sequelize = require('sequelize');

module.exports = class Rest_cate extends Sequelize.Model {
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
    Rest_cate.belongsTo(db.Restaurant);
    Rest_cate.belongsTo(db.Category);
  }
};
