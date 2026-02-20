import express from 'express';
import {
  getCarouselImages,
  getAllCarouselImages,
  addCarouselImage,
  updateCarouselImage,
  deleteCarouselImage,
} from '../controllers/carouselController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getCarouselImages).post(protect, admin, addCarouselImage);
router.route('/all').get(protect, admin, getAllCarouselImages);
router.route('/:id').put(protect, admin, updateCarouselImage).delete(protect, admin, deleteCarouselImage);

export default router;
