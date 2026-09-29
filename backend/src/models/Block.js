import mongoose from 'mongoose';

const blockSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Block name is required'],
      trim: true,
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
    centerLatitude: {
      type: Number,
      default: 28.6139,
    },
    centerLongitude: {
      type: Number,
      default: 77.209,
    },
    elevation: {
      type: Number,
      default: 215, // meters above sea level
    },
  },
  { timestamps: true }
);

blockSchema.index({ name: 1, district: 1 }, { unique: true });

const Block = mongoose.model('Block', blockSchema);
export default Block;
