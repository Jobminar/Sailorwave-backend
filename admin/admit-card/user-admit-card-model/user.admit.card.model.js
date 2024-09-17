import mongoose from "mongoose";

const admitSchema = new mongoose.Schema({
  name:{type:String,required:true},
  birthDate:{type:Date,required:true},
  gmail:{type:String,required:true},
  applicationNumber: { type: Number, required: true },
  applicationStatus: { type:Boolean,required: true,default:false },
  dateOfApplied: { type: Date, required: true },
  dateOfInterview: { type: Date, required: true },
  timeOfInterview: { type: String, required: true },
});
export default mongoose.model("Admitcard", admitSchema);

