const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('sqlite:database.sqlite', {
  logging: false,
});

export const Post = sequelize.define('post', {
  title: DataTypes.STRING,
});

export default sequelize;
