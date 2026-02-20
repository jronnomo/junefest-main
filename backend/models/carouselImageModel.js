import mongoose from 'mongoose';

const carouselImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    altText: { type: String, default: 'JUNEFEST photo' },
    caption: { type: String, default: '' },
    order: { type: Number, default: 0 },
    eventYear: { type: Number, default: null },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const CarouselImage = mongoose.model('CarouselImage', carouselImageSchema);
export default CarouselImage;
