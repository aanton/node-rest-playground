import sequelize, { Post, Comment, Tag } from './models';
import faker from 'faker';
import random from 'lodash.random';
import sampleSize from 'lodash.samplesize';

const recreate = async () => {
  await sequelize.sync({ force: true });
  console.log(`Database recreated`);
};

const getFakePosts = count => {
  return Array.from({ length: count }, () => {
    return {
      title: faker.lorem.sentence().replace(/\.$/, ''),
      comments: getFakeComments(random(1, 3)),
    };
  });
};

const getFakeComments = count => {
  return Array.from({ length: count }, () => {
    return {
      text: faker.lorem.paragraph().replace(/\.$/, ''),
    };
  });
};

const getFakeTags = count => {
  return Array.from({ length: count }, () => {
    const slug = faker.lorem.slug();
    const name = slug[0].toUpperCase() + slug.slice(1).replace('-', ' ');

    return {
      slug: slug,
      name: name,
    };
  });
};

const seed = async () => {
  await Promise.all(
    getFakeTags(10).map(async tag => {
      await Tag.create(tag);
    })
  );

  const tags = await Tag.findAll();

  await Promise.all(
    getFakePosts(5).map(async post => {
      const newPost = await Post.create(post, { include: Comment });
      newPost.addTags(sampleSize(tags, random(1, 5)));
    })
  );

  console.log(`Database seeded`);
};

(async () => {
  await sequelize.authenticate();
  await recreate();
  await seed();
})();
