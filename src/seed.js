import sequelize, { Post } from './models';
import faker from 'faker';

const recreate = async () => {
  await Post.sync({ force: true });
  console.log(`Database recreated`);
};

const seed = async () => {
  const posts = Array.from({ length: 5 }).map(() => {
    return {
      title: faker.lorem.sentence(),
    };
  });

  await Post.bulkCreate(posts);
  console.log(`Database seeded`);
};

(async () => {
  await sequelize.authenticate();
  await recreate();
  await seed();
})();
