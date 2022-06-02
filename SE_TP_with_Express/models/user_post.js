const Sequelize = require('sequelize');

module.exports = class User_post extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        /*
        chk: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        */
      },
      {
        sequelize,
        timestamps: false,
        underscored: true,
        modelName: 'User_post',
        tableName: 'user_post',
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
