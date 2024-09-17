import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
 
  userId: {
    type: mongoose.Schema.Types.String,
    ref: 'User',
    required: true,
  },
  isVerify: {
    type: Boolean, 
    default: false, 
  },
  mobile: {
    type: Number,
    required: true,
  },
  candidateName: {
    type: String,
    required: true,
    trim: true,
  },
  fatherName: {
    type: String,
    required: true,
    trim: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female', 'Other'],
  },
  email: {
    type: String,
    required: true,
  }
}, {
  timestamps: true, 
});

const UserApplication = mongoose.model('UserApplication', userSchema);

export default UserApplication;
