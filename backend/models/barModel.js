import mongoose from 'mongoose';

const barSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    order: { type: Number, required: true, default: 0 },
    image: { type: String, default: '' },
    description: { type: String, required: true },
    website: { type: String, default: '' },
    featuredDrink: { type: String, default: '' },
    address: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Bar = mongoose.model('Bar', barSchema);
export default Bar;
