import { Sequelize, DataTypes } from 'sequelize';

export default class Comment extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        text: {
          type: DataTypes.TEXT,
          allowNull: false,
          validate: {
            notEmpty: { msg: 'Parameter text is required' },
          },
        },
      },
      { sequelize, modelName: 'comment' }
    );
  }

  static associate(models) {
    this.belongsTo(models.Post);
  }

  static findByPost(postId) {
    return this.findAll({
      where: {
        postId: postId,
      },
      order: [['id', 'DESC']],
    });
  }
}
