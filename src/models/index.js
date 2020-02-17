import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize(
  process.env.NODE_ENV === 'test' ? 'sqlite::memory' : process.env.DATABASE_URI,
  {
    logging: false,
  }
);

export const Post = sequelize.define('post', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Parameter title is required' },
    },
  },
});

export const Comment = sequelize.define('comment', {
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Parameter text is required' },
    },
  },
});

export const Tag = sequelize.define('tag', {
  slug: { type: DataTypes.STRING, unique: true },
  name: DataTypes.STRING,
});

// In One-To-Many relationships the default for ON DELETE is SET NULL & the default for ON UPDATE is CASCADE
Post.hasMany(Comment, { onDelete: 'CASCADE' });
Comment.belongsTo(Post);

// In Many-To-Many relationships the defaults for both ON UPDATE and ON DELETE are CASCADE
Post.belongsToMany(Tag, { through: 'PostTags' });
Tag.belongsToMany(Post, { through: 'PostTags' });

Post.findByTag = async function(tagId) {
  return await this.findAll({
    include: [
      {
        model: Tag,
        required: true,
        through: {
          where: {
            tagId: tagId,
          },
        },
      },
    ],
  });
};

Tag.findWithPostsByPk = async function(key) {
  return await this.findByPk(key, {
    include: [
      {
        model: Post,
        attributes: ['id', 'title'],
        through: { attributes: [] },
      },
    ],
    order: [[Post, 'id', 'DESC']],
  });
};

export default sequelize;
