import sequelize, { Post, Comment } from './models';
import faker from 'faker';

const recreate = async () => {
  await sequelize.sync({ force: true });
  console.log(`Database recreated`);
};

const getFakePosts = count => {
  return Array.from({ length: count }, () => {
    return {
      title: faker.lorem.sentence(),
      comments: getFakeComments(faker.random.number({ min: 1, max: 3 })),
    };
  });
};

const getFakeComments = count => {
  return Array.from({ length: count }, () => {
    return {
      text: faker.lorem.paragraph(),
    };
  });
};

const seed = async () => {
  const posts = getFakePosts(5);

  await Promise.all(
    posts.map(async post => {
      await Post.create(post, { include: Comment });
    })
  );

  console.log(`Database seeded`);
};

(async () => {
  await sequelize.authenticate();
  await recreate();
  await seed();
})();
