import sequelize, { Post } from './models';
import faker from 'faker';

const recreateDatabase = async function() {
  await Post.sync({ force: true });
  console.log(`Database recreated`);
};

const seedDatabase = async function() {
  const posts = Array.from({ length: 5 }).map(() => {
    return {
      title: faker.lorem.sentence(),
    };
  });

  await Post.bulkCreate(posts);
  console.log(`Database seeded`);
};

sequelize
  .authenticate()
  .then(async () => {
    console.log(`Database connection has been established successfully`);

    await recreateDatabase();
    await seedDatabase();
  })
  .catch(err => {
    console.error(`Unable to connect to the database`, err);
  });
