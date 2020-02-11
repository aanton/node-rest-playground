import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';

import postsRoutes from './routes/posts';
import commentsRoutes from './routes/comments';
import tagsRoutes from './routes/tags';

const app = express();

// Middlewares
app.use(morgan('tiny'));
app.use(bodyParser.json());

// Routes
app.use('/api/posts', postsRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/tags', tagsRoutes);

// 404 routes
app.use(function(req, res) {
  res.status(404).json({ error: `Route not found: ${req.originalUrl}` });
});

export default app;
