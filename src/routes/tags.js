import express from 'express';
import { guardTag } from './guards';
import { Post, Tag } from '../models';

const getAll = async (req, res) => {
  const tags = await Tag.findAll({
    order: [['name', 'ASC']],
  });
  res.json(tags);
};

const get = async (req, res) => {
  const tag = await Tag.findByPk(res.locals.tag.id, {
    include: [
      {
        model: Post,
        attributes: ['id', 'title'],
        through: { attributes: [] },
      },
    ],
    order: [[Post, 'id', 'DESC']],
  });

  res.json(tag);
};

const remove = async (req, res) => {
  const tag = res.locals.tag;
  await tag.destroy();

  res.json(tag);
};

const router = express.Router();

router.get('/', getAll);
router.get('/:tagId(\\d+)', [guardTag, get]);
router.delete('/:tagId(\\d+)', [guardTag, remove]);

export default router;
