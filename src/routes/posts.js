import express from 'express';
import { Post, Comment, Tag } from '../models';

const guard = async (req, res, next) => {
  const postId = parseInt(req.params.postId);
  const post = await Post.findByPk(postId);
  if (!post) {
    return res.status(404).send({ error: `Post ${postId} not found` });
  }

  res.locals.post = post;
  next();
};

const getAll = async (req, res) => {
  const posts = await Post.findAll({
    order: [['id', 'DESC']],
  });
  res.json(posts);
};

const get = async (req, res) => {
  const post = await Post.findByPk(res.locals.post.id, {
    include: [
      { model: Comment, attributes: ['id', 'text', 'createdAt'] },
      {
        model: Tag,
        attributes: ['id', 'slug', 'name'],
        through: { attributes: [] },
      },
    ],
    order: [
      [Comment, 'id', 'DESC'],
      [Tag, 'name', 'ASC'],
    ],
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

const getAllComments = async (req, res) => {
  const post = res.locals.post;
  const comments = await post.getComments({
    order: [['id', 'DESC']],
  });
  res.json(comments);
};

const createComment = async (req, res) => {
  const post = res.locals.post;
  const comment = await post.createComment({
    text: req.body.text,
  });

  res.json(comment);
};

const router = express.Router();

router.get('/', getAll);
router.post('/', create);
router.get('/:postId(\\d+)', [guard, get]);
router.put('/:postId(\\d+)', [guard, update]);
router.delete('/:postId(\\d+)', [guard, remove]);

// Post's comments routes
router.get('/:postId/comments', [guard, getAllComments]);
router.post('/:postId/comments', [guard, createComment]);

export default router;
