export const healthCheck = (req, res) => {
  res.status(200).json({
    status: 'UP',
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    memory: process.memoryUsage(),
  });
};