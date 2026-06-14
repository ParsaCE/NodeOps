import pool from '../config/database.js';

export const getTodos = async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM todos ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

export const createTodo = async (req, res, next) => {
  try {
    const { title } = req.body;
    const result = await pool.query(
      'INSERT INTO todos (title, done) VALUES ($1, false) RETURNING *',
      [title]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};