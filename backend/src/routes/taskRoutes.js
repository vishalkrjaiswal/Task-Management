import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { listTasks, createTask, updateTask, deleteTask, dashboardStats } from '../controllers/taskController.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Task CRUD routes
router.get('/', listTasks);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.get('/stats/dashboard', dashboardStats);


export default router;
