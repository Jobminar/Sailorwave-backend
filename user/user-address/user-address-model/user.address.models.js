
import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.String,
    ref: "User",
    required: true,
  },
  houseNo: { type: String, required: true },
  policeStation: { type: String, required: true },
  postOffice: { type: String, required: true },
  district: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: Number, required: true },
});


export default mongoose.model("UserAddress", addressSchema);
