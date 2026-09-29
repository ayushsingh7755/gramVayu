import mongoose from 'mongoose';

const panchayatSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Panchayat name is required'],
      trim: true,
    },
    block: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Block',
      required: [true, 'Block reference is required'],
    },
    district: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'District',
      required: [true, 'District reference is required'],
    },
    state: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'State',
      required: [true, 'State reference is required'],
    },
    latitude: {
      type: Number,
      required: [true, 'Latitude is required for spatial downscaling and mapping'],
    },
    longitude: {
      type: Number,
      required: [true, 'Longitude is required for spatial downscaling and mapping'],
    },
    elevation: {
      type: Number,
      default: 215, // meters above sea level
    },
    area: {
      type: Number, // in sq. km
      default: 12.5,
    },
    population: {
      type: Number,
      default: 6500,
    },
    vegetationFactor: {
      type: Number, // 0.0 (barren/urban) to 1.0 (dense agricultural/canopy)
      default: 0.65,
      min: 0,
      max: 1,
    },
    primaryCrops: {
      type: [String],
      default: ['Wheat', 'Paddy', 'Mustard'],
    },
  },
  { timestamps: true }
);

panchayatSchema.index({ name: 1, block: 1 }, { unique: true });

const Panchayat = mongoose.model('Panchayat', panchayatSchema);
export default Panchayat;
