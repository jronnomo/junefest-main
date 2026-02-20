import express from 'express';
import {
  getBars,
  getAllBars,
  getBarById,
  createBar,
  updateBar,
  deleteBar,
} from '../controllers/barController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getBars).post(protect, admin, createBar);
router.route('/all').get(protect, admin, getAllBars);
router.route('/:id').get(getBarById).put(protect, admin, updateBar).delete(protect, admin, deleteBar);

export default router;
