import sequelize, { Post } from './models';

const recreateDatabase = async function() {
  await Post.sync({ force: true });
  console.log(`Database recreated`);
};

const seedDatabase = async function() {
  await Post.create({ title: 'My first post' });
  await Post.create({ title: 'My second post' });
  await Post.create({ title: 'My third post' });
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
