import mongoose from 'mongoose';

const educationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  examPassed: {
    type: String,
    required: true,
    enum: ['10th', '12th', 'ITI/Diploma'],
  },
  schoolOrCollege: {
    type: String,
    required: true,
    trim: true,
  },
  yearOfPassing: {
    type: Number,
    required: true,
  },
  percentage: {
    type: Number,
    required: true,
  },
});

const Education = mongoose.model('Education', educationSchema);

export default Education;
