import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  junefestDate: { type: Date, default: null },
  junefestLabel: { type: String, default: 'JUNEFEST' },
});

const Settings = mongoose.model('Settings', settingsSchema);
export default Settings;
