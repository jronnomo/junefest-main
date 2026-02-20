import asyncHandler from '../middleware/asyncHandler.js';
import Settings from '../models/settingsModel.js';

// @desc  Get settings
// @route GET /api/settings
// @access Public
const getSettings = asyncHandler(async (req, res) => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({});
  }
  res.json(settings);
});

// @desc  Update settings
// @route PUT /api/settings
// @access Private/Admin
const updateSettings = asyncHandler(async (req, res) => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({});
  }
  settings.junefestDate = req.body.junefestDate ?? settings.junefestDate;
  settings.junefestLabel = req.body.junefestLabel ?? settings.junefestLabel;
  const updated = await settings.save();
  res.json(updated);
});

export { getSettings, updateSettings };
