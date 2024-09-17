import mongoose from "mongoose";

const documentsSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.String, ref: "User", required: true },
    image: { type: String, required: true },
    tenthCertificates: { type: String, required: true },
    adharCard: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("UserDocuments", documentsSchema);
