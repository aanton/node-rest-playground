import { Sequelize, DataTypes } from 'sequelize';

export default class Tag extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        slug: { type: DataTypes.STRING, unique: true },
        name: DataTypes.STRING,
      },
      { sequelize, modelName: 'tag' }
    );
  }

  static associate(models) {
    // In Many-To-Many relationships the defaults for both ON UPDATE and ON DELETE are CASCADE
    this.belongsToMany(models.Post, { through: 'PostTags' });
  }

  static findWithPostsByPk(key) {
    return this.findByPk(key, {
      include: [
        {
          model: this.sequelize.model('post'),
          attributes: ['id', 'title'],
          through: { attributes: [] },
        },
      ],
      order: [[this.sequelize.model('post'), 'id', 'DESC']],
    });
  }

  static findByPost(postId) {
    return this.findAll({
      include: [
        {
          model: this.sequelize.model('post'),
          required: true,
          through: {
            where: {
              postId: postId,
            },
          },
        },
      ],
    });
  }
}
