import mongoose from 'mongoose';

const stateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'State name is required'],
      trim: true,
      unique: true,
    },
    code: {
      type: String,
      required: [true, 'State code is required'],
      uppercase: true,
      trim: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const State = mongoose.model('State', stateSchema);
export default State;
