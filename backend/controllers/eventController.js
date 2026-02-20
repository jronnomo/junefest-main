import asyncHandler from '../middleware/asyncHandler.js';
import Event from '../models/eventModel.js';

// @desc    Get all active events
// @route   GET /api/events
// @access  Public
const getEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({ isActive: true }).sort({ date: -1 });
  res.json(events);
});

// @desc    Get all events including inactive (admin)
// @route   GET /api/events/all
// @access  Private/Admin
const getAllEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({}).sort({ date: -1 });
  res.json(events);
});

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public
const getEventById = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (event) {
    res.json(event);
  } else {
    res.status(404);
    throw new Error('Event not found');
  }
});

// @desc    Create an event
// @route   POST /api/events
// @access  Private/Admin
const createEvent = asyncHandler(async (req, res) => {
  const { title, eventType, year, date, location, description, isActive } = req.body;

  const event = new Event({
    title,
    eventType: eventType || 'other',
    year,
    date,
    location: location || '',
    description,
    photos: [],
    rsvps: [],
    isActive: isActive !== undefined ? isActive : true,
    createdBy: req.user._id,
  });

  const createdEvent = await event.save();
  res.status(201).json(createdEvent);
});

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private/Admin
const updateEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (event) {
    event.title = req.body.title ?? event.title;
    event.eventType = req.body.eventType ?? event.eventType;
    event.year = req.body.year ?? event.year;
    event.date = req.body.date ?? event.date;
    event.location = req.body.location ?? event.location;
    event.description = req.body.description ?? event.description;
    event.isActive = req.body.isActive !== undefined ? req.body.isActive : event.isActive;

    const updatedEvent = await event.save();
    res.json(updatedEvent);
  } else {
    res.status(404);
    throw new Error('Event not found');
  }
});

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private/Admin
const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (event) {
    await Event.deleteOne({ _id: event._id });
    res.json({ message: 'Event removed' });
  } else {
    res.status(404);
    throw new Error('Event not found');
  }
});

// @desc    Add a photo to an event
// @route   POST /api/events/:id/photos
// @access  Private/Admin
const addEventPhoto = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (event) {
    const { url, caption } = req.body;
    event.photos.push({ url, caption: caption || '' });
    const updatedEvent = await event.save();
    res.status(201).json(updatedEvent);
  } else {
    res.status(404);
    throw new Error('Event not found');
  }
});

// @desc    Remove a photo from an event
// @route   DELETE /api/events/:id/photos/:photoId
// @access  Private/Admin
const removeEventPhoto = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (event) {
    event.photos = event.photos.filter(
      (p) => p._id.toString() !== req.params.photoId
    );
    const updatedEvent = await event.save();
    res.json(updatedEvent);
  } else {
    res.status(404);
    throw new Error('Event not found');
  }
});

// @desc    RSVP for an event
// @route   POST /api/events/:id/rsvp
// @access  Private
const rsvpEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  const alreadyRsvp = event.rsvps.find(
    (r) => r.user.toString() === req.user._id.toString()
  );

  if (alreadyRsvp) {
    res.status(400);
    throw new Error('You have already RSVP\'d to this event');
  }

  event.rsvps.push({ user: req.user._id });
  await event.save();
  res.status(201).json({ message: 'RSVP confirmed' });
});

// @desc    Cancel RSVP for an event
// @route   DELETE /api/events/:id/rsvp
// @access  Private
const cancelRsvp = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  event.rsvps = event.rsvps.filter(
    (r) => r.user.toString() !== req.user._id.toString()
  );
  await event.save();
  res.json({ message: 'RSVP cancelled' });
});

// @desc    Get RSVPs for an event (admin)
// @route   GET /api/events/:id/rsvps
// @access  Private/Admin
const getEventRsvps = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id).populate('rsvps.user', 'name email');
  if (event) {
    res.json(event.rsvps);
  } else {
    res.status(404);
    throw new Error('Event not found');
  }
});

export {
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
};
