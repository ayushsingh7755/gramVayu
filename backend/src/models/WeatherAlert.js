import mongoose from 'mongoose';

const weatherAlertSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Alert title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Alert description is required'],
    },
    severity: {
      type: String,
      enum: ['low', 'moderate', 'high', 'severe'],
      required: true,
      default: 'moderate',
    },
    type: {
      type: String,
      enum: [
        'heavy_rain',
        'thunderstorm',
        'high_temperature',
        'strong_wind',
        'low_temperature',
        'flood_risk',
      ],
      required: true,
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
      default: null,
    },
    startTime: {
      type: Date,
      required: true,
      default: Date.now,
    },
    endTime: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
);

const WeatherAlert = mongoose.model('WeatherAlert', weatherAlertSchema);
export default WeatherAlert;
