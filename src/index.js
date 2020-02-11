import app from './server';
import sequelize from './models';

const startServer = () => {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Listening on port ${port}`));
};

sequelize
  .authenticate()
  .then(() => startServer())
  .catch(err => console.error('Unable to connect to the database:', err));
