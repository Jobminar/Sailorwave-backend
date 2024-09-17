import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  phone: {type: String, required: true,  unique: true },
  otp: { type: Number },
  otpExpiry: {type: Date},
},

 {
  timestamps: true, 
});

const User = mongoose.model("User", userSchema);

export default User;
