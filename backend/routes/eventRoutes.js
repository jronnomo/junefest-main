import express from 'express';
import {
  getEvents,
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  addEventPhoto,
  removeEventPhoto,
  rsvpEvent,
  cancelRsvp,
  getEventRsvps,
} from '../controllers/eventController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getEvents).post(protect, admin, createEvent);
router.route('/all').get(protect, admin, getAllEvents);
router.route('/:id').get(getEventById).put(protect, admin, updateEvent).delete(protect, admin, deleteEvent);
router.route('/:id/photos').post(protect, admin, addEventPhoto);
router.route('/:id/photos/:photoId').delete(protect, admin, removeEventPhoto);
router.route('/:id/rsvp').post(protect, rsvpEvent).delete(protect, cancelRsvp);
router.route('/:id/rsvps').get(protect, admin, getEventRsvps);

export default router;
