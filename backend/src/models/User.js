import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    role: {
      type: String,
      enum: ['farmer', 'officer', 'admin'],
      default: 'farmer',
    },
    state: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'State',
      default: null,
    },
    district: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'District',
      default: null,
    },
    block: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Block',
      default: null,
    },
    panchayat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Panchayat',
      default: null,
    },
    avatarUrl: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
