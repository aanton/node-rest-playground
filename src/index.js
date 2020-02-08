import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';

import sequelize from './models';
import postsRoutes from './routes/posts';
import commentsRoutes from './routes/comments';
import tagsRoutes from './routes/tags';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

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

// Start database connection & web server
const startServer = () => {
  app.listen(port, () => console.log(`Listening on port ${port}`));
};

sequelize
  .authenticate()
  .then(() => startServer())
  .catch(err => console.error('Unable to connect to the database:', err));
