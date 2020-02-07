import express from 'express';
import { guardPost } from './guards';

const getAll = async (req, res) => {
  const post = res.locals.post;
  const comments = await post.getComments({
    order: [['id', 'DESC']],
  });
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
