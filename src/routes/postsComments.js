import express from 'express';
import { Post, Comment } from '../models';

const guardPost = async (req, res, next) => {
  const postId = parseInt(req.params.postId);
  const post = await Post.findByPk(postId);
  if (!post) {
    return res.status(404).send({ error: `Post ${postId} not found` });
  }

  res.locals.post = post;
  next();
};

const getAll = async (req, res) => {
  const post = res.locals.post;
  const comments = await post.getComments();
  res.json(comments);
};

const create = async (req, res) => {
  const post = res.locals.post;
  const comment = await post.createComment({
    text: req.body.text,
  });

  res.json(comment);
};

const router = express.Router();

router.get('/:postId/comments', [guardPost, getAll]);
router.post('/:postId/comments', [guardPost, create]);

export default router;
