import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password:{type:String,required:true},
    otp: { type: Number, required: false },
    otpExpires: { type: Date, required: false }    
  },
  {
    timestamps: true,
  }
);
const Admin = mongoose.model("Admin", adminSchema);

export default Admin;
