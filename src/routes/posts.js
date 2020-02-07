import express from 'express';
import { guardPost } from './guards';
import { Post, Comment } from '../models';

const getAll = async (req, res) => {
  const posts = await Post.findAll({
    order: [['id', 'DESC']],
  });
  res.json(posts);
};

const get = async (req, res) => {
  const post = await Post.findByPk(res.locals.post.id, {
    include: Comment,
    order: [[Comment, 'id', 'DESC']],
  });

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
router.post('/', create);
router.get('/:postId(\\d+)', [guardPost, get]);
router.put('/:postId(\\d+)', [guardPost, update]);
router.delete('/:postId(\\d+)', [guardPost, remove]);

export default router;
