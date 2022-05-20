const Sequelize = require('sequelize');

module.exports = class Post_content extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        post_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        user_id: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
        },
        delivery_fee: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
        },
        content: {
          type: Sequelize.TEXT,
          allowNull: false,
          unique: false,
        },
      },
      {
        sequelize,
        timestamps: false,
        underscored: true,
        modelName: 'Post_content',
        tableName: 'post_content',
        paranoid: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    );
  }

  static associate(db) {
    db.Post_content.belongsTo(db.Post, {
      foreignKey: 'post_id',
      targetKey: 'id',
    });
  }
};
