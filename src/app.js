import express from 'express';
import logger from './utils/logger.js';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  logger.info('Root endpoint hit');
  res.json({ message: 'NodeOps API is running!' });
});

// Error Handler
app.use((err, req, res, next) => {
  logger.error(err.message);
  res.status(500).json({ error: 'Internal Server Error' });
});

export default app;