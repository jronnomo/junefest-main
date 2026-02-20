import asyncHandler from '../middleware/asyncHandler.js';
import CarouselImage from '../models/carouselImageModel.js';

// @desc    Get all active carousel images sorted by order
// @route   GET /api/carousel
// @access  Public
const getCarouselImages = asyncHandler(async (req, res) => {
  const images = await CarouselImage.find({ isActive: true }).sort({ order: 1 });
  res.json(images);
});

// @desc    Get all carousel images including inactive (admin)
// @route   GET /api/carousel/all
// @access  Private/Admin
const getAllCarouselImages = asyncHandler(async (req, res) => {
  const images = await CarouselImage.find({}).sort({ order: 1 });
  res.json(images);
});

// @desc    Add a carousel image
// @route   POST /api/carousel
// @access  Private/Admin
const addCarouselImage = asyncHandler(async (req, res) => {
  const { url, altText, caption, order, eventYear } = req.body;

  // Auto-assign order if not provided
  const lastImage = await CarouselImage.findOne().sort({ order: -1 });
  const nextOrder = order !== undefined ? order : (lastImage ? lastImage.order + 1 : 0);

  const image = new CarouselImage({
    url,
    altText: altText || 'JUNEFEST photo',
    caption: caption || '',
    order: nextOrder,
    eventYear: eventYear || null,
    uploadedBy: req.user._id,
    isActive: true,
  });

  const createdImage = await image.save();
  res.status(201).json(createdImage);
});

// @desc    Update a carousel image
// @route   PUT /api/carousel/:id
// @access  Private/Admin
const updateCarouselImage = asyncHandler(async (req, res) => {
  const image = await CarouselImage.findById(req.params.id);
  if (image) {
    image.altText = req.body.altText ?? image.altText;
    image.caption = req.body.caption ?? image.caption;
    image.order = req.body.order ?? image.order;
    image.eventYear = req.body.eventYear ?? image.eventYear;
    image.isActive = req.body.isActive !== undefined ? req.body.isActive : image.isActive;

    const updatedImage = await image.save();
    res.json(updatedImage);
  } else {
    res.status(404);
    throw new Error('Carousel image not found');
  }
});

// @desc    Delete a carousel image
// @route   DELETE /api/carousel/:id
// @access  Private/Admin
const deleteCarouselImage = asyncHandler(async (req, res) => {
  const image = await CarouselImage.findById(req.params.id);
  if (image) {
    await CarouselImage.deleteOne({ _id: image._id });
    res.json({ message: 'Carousel image removed' });
  } else {
    res.status(404);
    throw new Error('Carousel image not found');
  }
});

export {
  getCarouselImages,
  getAllCarouselImages,
  addCarouselImage,
  updateCarouselImage,
  deleteCarouselImage,
};
