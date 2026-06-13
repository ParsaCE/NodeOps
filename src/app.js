import express from 'express';
import logger from './utils/logger.js';
import healthRouter from './routes/health.routes.js';

const app = express();

app.use(express.json());
app.use(healthRouter);

app.get('/', (req, res) => {
  logger.info('Root endpoint hit');
  res.json({ message: 'NodeOps API is running!' });
});

app.use((err, req, res, _next) => {
  logger.error(err.message);
  res.status(500).json({ error: 'Internal Server Error' });
});

export default app;