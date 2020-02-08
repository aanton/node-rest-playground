import { Post, Comment, Tag } from '../models';

export const guardPost = async (req, res, next) => {
  const postId = parseInt(req.params.postId);
  const post = await Post.findByPk(postId);
  if (!post) {
    return res.status(404).send({ error: `Post ${postId} not found` });
  }

  res.locals.post = post;
  next();
};

export const guardComment = async (req, res, next) => {
  const commentId = parseInt(req.params.commentId);
  const comment = await Comment.findByPk(commentId);
  if (!comment) {
    return res.status(404).send({ error: `Comment ${commentId} not found` });
  }

  res.locals.comment = comment;
  next();
};

export const guardTag = async (req, res, next) => {
  const tagId = parseInt(req.params.tagId);
  const tag = await Tag.findByPk(tagId);
  if (!tag) {
    return res.status(404).send({ error: `Tag ${tagId} not found` });
  }

  res.locals.tag = tag;
  next();
};
