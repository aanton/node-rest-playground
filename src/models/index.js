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

Post.hasMany(Comment, { onDelete: 'CASCADE' });
Comment.belongsTo(Post);

export default sequelize;
