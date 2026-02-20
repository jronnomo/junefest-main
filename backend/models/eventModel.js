import mongoose from 'mongoose';

const photoSchema = new mongoose.Schema({
  url: { type: String, required: true },
  caption: { type: String, default: '' },
});

const rsvpSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  },
  { timestamps: true }
);

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    eventType: {
      type: String,
      enum: ['bar-crawl', 'golf', 'happy-hour', 'other'],
      default: 'other',
    },
    year: { type: Number, required: true },
    date: { type: Date, required: true },
    location: { type: String, default: '' },
    description: { type: String, required: true },
    photos: [photoSchema],
    rsvps: [rsvpSchema],
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  },
  { timestamps: true }
);

const Event = mongoose.model('Event', eventSchema);
export default Event;
