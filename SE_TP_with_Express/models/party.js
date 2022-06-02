const Sequelize = require('sequelize');

module.exports = class Party extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        content: {
          type: Sequelize.STRING(200), // 200byte 제한.
          allowNull: false,
        },
        user_id: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
        },
        transaction_point: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        is_checked: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: true,
        modelName: 'Party',
        tableName: 'party',
        paranoid: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    );
  }

  static associate(db) {
    db.Party.belongsTo(db.Post, {
      foreignKey: 'post_id',
      targetKey: 'id',
    });
  }
};
