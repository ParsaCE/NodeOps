import express from 'express';
import { getTodos, createTodo } from '../controllers/todos.controller.js';

const router = express.Router();

router.get('/todos', getTodos);
router.post('/todos', createTodo);

export default router;