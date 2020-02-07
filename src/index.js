import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';

import sequelize from './models';
import postsRoutes from './routes/posts';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(morgan('tiny'));
app.use(bodyParser.json());

// Routes
app.use('/api/posts', postsRoutes);

// Start server

sequelize
  .authenticate()
  .then(() => {
    console.log('Database connection has been established successfully');

    app.listen(port, () => console.log(`Listening on port ${port}`));
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
