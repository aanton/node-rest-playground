import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import sequelize, { Post } from './models';

dotenv.config();
const app = express();

// Middlewares
app.use(morgan('tiny'));
app.use(bodyParser.json());

// Routes
app.get('/api/posts', async (req, res) => {
  const posts = await Post.findAll();
  res.json(posts);
});

app.get('/api/post/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const post = await Post.findByPk(id);
  if (!post) {
    return res.status(404).send({ error: `Post ${id} not found` });
  }

  res.json(post);
});

app.post('/api/posts', async (req, res) => {
  const post = await Post.create({
    title: req.body.title,
  });

  res.json(post);
});

app.put('/api/post/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const post = await Post.findByPk(id);
  if (!post) {
    return res.status(404).send({ error: `Post ${id} not found` });
  }

  post.title = req.body.title;
  await post.save();

  res.json(post);
});

app.delete('/api/post/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const post = await Post.findByPk(id);
  if (!post) {
    return res.status(404).send({ error: `Post ${id} not found` });
  }

  await post.destroy();

  res.json(post);
});

// Start server

sequelize
  .authenticate()
  .then(() => {
    console.log('Database connection has been established successfully');

    app.listen(process.env.PORT, () =>
      console.log(`Listening on port ${process.env.PORT}`)
    );
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
