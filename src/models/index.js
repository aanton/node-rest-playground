const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('sqlite:database.sqlite', {
  logging: false,
});

export const Post = sequelize.define('post', {
  title: DataTypes.STRING,
});

export const Comment = sequelize.define('comment', {
  text: DataTypes.TEXT,
});

export const Tag = sequelize.define('tag', {
  slug: { type: DataTypes.STRING, unique: true },
  name: DataTypes.STRING,
});

Post.hasMany(Comment, { onDelete: 'CASCADE' });
Comment.belongsTo(Post);

// The defaults for both ON UPDATE and ON DELETE are CASCADE for Many-To-Many relationships
Post.belongsToMany(Tag, { through: 'PostTags' });
Tag.belongsToMany(Post, { through: 'PostTags' });

export default sequelize;
