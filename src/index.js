import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';

dotenv.config();
const app = express();

// Middlewares
app.use(morgan('tiny'));
app.use(bodyParser.json());

// Fake data
const posts = [
  { id: 1, title: 'My first post' },
  { id: 2, title: 'My second post' },
  { id: 3, title: 'My third post' },
];
let postsIndex = 4;

const getPostOrFail = function(req, res) {
  const id = parseInt(req.params.id);
  const post = posts.find(post => post.id === id);

  if (!post) {
    res.status(404).send({ error: `Post ${id} not found` });
  }

  return post;
};

// Routes
app.get('/api/posts', (req, res) => res.json(posts));

app.get('/api/post/:id', (req, res) => {
  const post = getPostOrFail(req, res);
  res.json(post);
});

app.post('/api/posts', (req, res) => {
  const newPost = {
    id: postsIndex++,
    title: req.body.title,
  };
  posts.push(newPost);

  res.json(newPost);
});

app.put('/api/post/:id', (req, res) => {
  const postToUpdate = getPostOrFail(req, res);
  postToUpdate.title = req.body.title;

  res.json(postToUpdate);
});

app.delete('/api/post/:id', (req, res) => {
  const postToRemove = getPostOrFail(req, res);
  const postIndex = posts.findIndex(post => post.id === postToRemove.id);
  posts.splice(postIndex, 1);

  res.json(postToRemove);
});

// Start server
app.listen(process.env.PORT, () =>
  console.log(`Listening on port ${process.env.PORT}`)
);
