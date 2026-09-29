import mongoose from 'mongoose';

const advisorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Advisory title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Advisory description is required'],
    },
    category: {
      type: String,
      enum: [
        'irrigation',
        'sowing',
        'harvesting',
        'pest_management',
        'fertilizer',
        'crop_protection',
        'weather_alert',
        'general',
      ],
      required: true,
      default: 'general',
    },
    crop: {
      type: String,
      required: [true, 'Crop name is required'],
      trim: true,
    },
    weatherCondition: {
      type: String,
      required: [true, 'Weather condition trigger is required'],
      trim: true,
    },
    state: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'State',
      required: true,
    },
    district: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'District',
      required: true,
    },
    block: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Block',
      required: true,
    },
    panchayat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Panchayat',
      default: null, // null implies applicable to entire Block
    },
    severity: {
      type: String,
      enum: ['low', 'moderate', 'high', 'severe'],
      default: 'moderate',
    },
    recommendations: {
      type: [String],
      default: [],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    attachments: [
      {
        url: String,
        publicId: String,
        name: String,
        format: String,
      },
    ],
  },
  { timestamps: true }
);

const Advisory = mongoose.model('Advisory', advisorySchema);
export default Advisory;
