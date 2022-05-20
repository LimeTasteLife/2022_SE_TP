const Sequelize = require('sequelize');

module.exports = class Report extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        title: {
          type: Sequelize.STRING(100),
          allowNull: false,
          unique: false,
        },
        content: {
          type: Sequelize.TEXT,
          allowNull: false,
          unique: false,
        },
        email: {
          type: Sequelize.STRING(50),
          allowNull: true,
        },
        target_id: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: true,
        modelName: 'Report',
        tableName: 'report',
        paranoid: true,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    );
  }

  static associate(db) {
    db.Report.belongsTo(db.User);
  }
};
