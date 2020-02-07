import express from 'express';
import { Post } from '../models';

const router = express.Router();

router.get('/', async (req, res) => {
  const posts = await Post.findAll();
  res.json(posts);
});

router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const post = await Post.findByPk(id);
  if (!post) {
    return res.status(404).send({ error: `Post ${id} not found` });
  }

  res.json(post);
});

router.post('/', async (req, res) => {
  const post = await Post.create({
    title: req.body.title,
  });

  res.json(post);
});

router.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const post = await Post.findByPk(id);
  if (!post) {
    return res.status(404).send({ error: `Post ${id} not found` });
  }

  post.title = req.body.title;
  await post.save();

  res.json(post);
});

router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const post = await Post.findByPk(id);
  if (!post) {
    return res.status(404).send({ error: `Post ${id} not found` });
  }

  await post.destroy();

  res.json(post);
});

export default router;
