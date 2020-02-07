import express from 'express';
import { Post, Comment } from '../models';

const guard = async (req, res, next) => {
  const id = parseInt(req.params.id);
  const post = await Post.findByPk(id);
  if (!post) {
    return res.status(404).send({ error: `Post ${id} not found` });
  }

  res.locals.post = post;
  next();
};

const getAll = async (req, res) => {
  const posts = await Post.findAll({
    include: Comment,
  });
  res.json(posts);
};

const get = async (req, res) => {
  const post = res.locals.post;
  res.json(post);
};

const create = async (req, res) => {
  const post = await Post.create({
    title: req.body.title,
  });

  res.json(post);
};

const update = async (req, res) => {
  const post = res.locals.post;
  post.title = req.body.title;
  await post.save();

  res.json(post);
};

const remove = async (req, res) => {
  const post = res.locals.post;
  await post.destroy();

  res.json(post);
};

const router = express.Router();

router.get('/', getAll);
router.get('/:id(\\d+)', [guard, get]);
router.post('/', create);
router.put('/:id(\\d+)', [guard, update]);
router.delete('/:id(\\d+)', [guard, remove]);

export default router;
