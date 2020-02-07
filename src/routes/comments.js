import express from 'express';
import { guardComment } from './guards';
import { Comment } from '../models';

const getAll = async (req, res) => {
  const comments = await Comment.findAll({
    order: [['id', 'DESC']],
  });
  res.json(comments);
};

const remove = async (req, res) => {
  const comment = res.locals.comment;
  await comment.destroy();

  res.json(comment);
};

const router = express.Router();

router.get('/', getAll);
router.delete('/:commentId(\\d+)', [guardComment, remove]);

export default router;
