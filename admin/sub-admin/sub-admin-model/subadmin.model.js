import mongoose from "mongoose";

const subadminSchema=new mongoose.Schema({
 name:{type:String,required:true},
 mobile:{type:Number,required:true},
 email:{type:String,unique:true,required:true},
 password:{type:String,required:true},
 image:{type:String,required:true}
})
const Subadmin=mongoose.model("Subadmin",subadminSchema)
export default Subadmin