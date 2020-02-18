import { Sequelize } from 'sequelize';
import Comment from './comment';
import Post from './post';
import Tag from './tag';

export const sequelize = new Sequelize(
  process.env.NODE_ENV === 'test' ? 'sqlite::memory' : process.env.DATABASE_URI,
  {
    logging: false,
  }
);

export const models = {
  Comment: Comment.init(sequelize),
  Post: Post.init(sequelize),
  Tag: Tag.init(sequelize),
};

Object.values(models)
  .filter(model => typeof model.associate === 'function')
  .forEach(model => model.associate(models));
