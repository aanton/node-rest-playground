import express from 'express';
import { models } from '../models';

const { Tag } = models;

const guard = async (req, res, next) => {
  const tagId = parseInt(req.params.tagId);
  const tag = await Tag.findByPk(tagId);
  if (!tag) {
    return res.status(404).send({ error: `Tag ${tagId} not found` });
  }

  res.locals.tag = tag;
  next();
};

const getAll = async (req, res) => {
  const tags = await Tag.findAll({
    order: [['name', 'ASC']],
  });
  res.json(tags);
};

const get = async (req, res) => {
  const tagId = parseInt(req.params.tagId);
  const tag = await Tag.findWithPostsByPk(req.params.tagId);
  if (!tag) {
    return res.status(404).send({ error: `Tag ${tagId} not found` });
  }

  res.json(tag);
};

const remove = async (req, res) => {
  const tag = res.locals.tag;
  await tag.destroy();

  res.json(tag);
};

const router = express.Router();

router.get('/', getAll);
router.get('/:tagId(\\d+)', [get]);
router.delete('/:tagId(\\d+)', [guard, remove]);

export default router;
