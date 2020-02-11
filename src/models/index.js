const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URI, {
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

// In One-To-Many relationships the default for ON DELETE is SET NULL & the default for ON UPDATE is CASCADE
Post.hasMany(Comment, { onDelete: 'CASCADE' });
Comment.belongsTo(Post);

// In Many-To-Many relationships the defaults for both ON UPDATE and ON DELETE are CASCADE
Post.belongsToMany(Tag, { through: 'PostTags' });
Tag.belongsToMany(Post, { through: 'PostTags' });

export default sequelize;
