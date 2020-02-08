import express from 'express';
import { Comment } from '../models';

const guard = async (req, res, next) => {
  const commentId = parseInt(req.params.commentId);
  const comment = await Comment.findByPk(commentId);
  if (!comment) {
    return res.status(404).send({ error: `Comment ${commentId} not found` });
  }

  res.locals.comment = comment;
  next();
};

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
router.delete('/:commentId(\\d+)', [guard, remove]);

export default router;
