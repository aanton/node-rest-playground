import express from 'express';
import { Op } from 'sequelize';
import { models } from '../models';

const { Comment } = models;

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

const search = async (req, res) => {
  const search = (req.query.q || '').trim();
  if (!search) {
    return res.status(404).send({ error: `Search parameter is empty/invalid` });
  }
  if (search.length < 3) {
    return res.status(404).send({ error: `Search parameter is too short` });
  }

  const comments = await Comment.findAll({
    where: {
      text: {
        [Op.substring]: search,
      },
    },
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
router.get('/search', search);
router.delete('/:commentId(\\d+)', [guard, remove]);

export default router;
