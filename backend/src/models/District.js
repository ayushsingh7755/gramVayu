import mongoose from 'mongoose';

const districtSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'District name is required'],
      trim: true,
    },
    code: {
      type: String,
      trim: true,
      uppercase: true,
    },
    state: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'State',
      required: [true, 'State reference is required'],
    },
  },
  { timestamps: true }
);

districtSchema.index({ name: 1, state: 1 }, { unique: true });

const District = mongoose.model('District', districtSchema);
export default District;
