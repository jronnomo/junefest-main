import asyncHandler from '../middleware/asyncHandler.js';
import Bar from '../models/barModel.js';

// @desc    Get all active bars (sorted by order)
// @route   GET /api/bars
// @access  Public
const getBars = asyncHandler(async (req, res) => {
  const bars = await Bar.find({ isActive: true }).sort({ order: 1 });
  res.json(bars);
});

// @desc    Get all bars including inactive (admin)
// @route   GET /api/bars/all
// @access  Private/Admin
const getAllBars = asyncHandler(async (req, res) => {
  const bars = await Bar.find({}).sort({ order: 1 });
  res.json(bars);
});

// @desc    Get single bar by ID
// @route   GET /api/bars/:id
// @access  Public
const getBarById = asyncHandler(async (req, res) => {
  const bar = await Bar.findById(req.params.id);
  if (bar) {
    res.json(bar);
  } else {
    res.status(404);
    throw new Error('Bar not found');
  }
});

// @desc    Create a bar
// @route   POST /api/bars
// @access  Private/Admin
const createBar = asyncHandler(async (req, res) => {
  const { name, order, image, description, website, featuredDrink, address, isActive } = req.body;

  const bar = new Bar({
    name,
    order: order || 0,
    image: image || '',
    description,
    website: website || '',
    featuredDrink: featuredDrink || '',
    address: address || '',
    isActive: isActive !== undefined ? isActive : true,
  });

  const createdBar = await bar.save();
  res.status(201).json(createdBar);
});

// @desc    Update a bar
// @route   PUT /api/bars/:id
// @access  Private/Admin
const updateBar = asyncHandler(async (req, res) => {
  const bar = await Bar.findById(req.params.id);
  if (bar) {
    bar.name = req.body.name ?? bar.name;
    bar.order = req.body.order ?? bar.order;
    bar.image = req.body.image ?? bar.image;
    bar.description = req.body.description ?? bar.description;
    bar.website = req.body.website ?? bar.website;
    bar.featuredDrink = req.body.featuredDrink ?? bar.featuredDrink;
    bar.address = req.body.address ?? bar.address;
    bar.isActive = req.body.isActive !== undefined ? req.body.isActive : bar.isActive;

    const updatedBar = await bar.save();
    res.json(updatedBar);
  } else {
    res.status(404);
    throw new Error('Bar not found');
  }
});

// @desc    Delete a bar
// @route   DELETE /api/bars/:id
// @access  Private/Admin
const deleteBar = asyncHandler(async (req, res) => {
  const bar = await Bar.findById(req.params.id);
  if (bar) {
    await Bar.deleteOne({ _id: bar._id });
    res.json({ message: 'Bar removed' });
  } else {
    res.status(404);
    throw new Error('Bar not found');
  }
});

export { getBars, getAllBars, getBarById, createBar, updateBar, deleteBar };
