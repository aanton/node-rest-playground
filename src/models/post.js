import { Sequelize, DataTypes } from 'sequelize';

export default class Post extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        title: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notEmpty: { msg: 'Parameter title is required' },
          },
        },
      },
      { sequelize, modelName: 'post' }
    );
  }

  static associate(models) {
    // In One-To-Many relationships the default for ON DELETE is SET NULL & the default for ON UPDATE is CASCADE
    this.hasMany(models.Comment, { onDelete: 'CASCADE' });

    // In Many-To-Many relationships the defaults for both ON UPDATE and ON DELETE are CASCADE
    this.belongsToMany(models.Tag, { through: 'PostTags' });
  }

  static findByTag(tagId) {
    return this.findAll({
      include: [
        {
          model: this.sequelize.model('tag'),
          required: true,
          through: {
            where: {
              tagId: tagId,
            },
          },
        },
      ],
    });
  }
}
