import express from 'express';
import bodyParser from 'body-parser';
import { sequelize } from './models/index.js'; // Import the sequelize instance
import Routes from './routes/index.js';

const app = express();
app.use(express.json());

app.use('/api', Routes);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch((error) => {
  console.error('Unable to connect to the database:', error);
});
