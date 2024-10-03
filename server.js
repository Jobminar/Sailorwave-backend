import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import router from "./router/index.js";

dotenv.config();

const app = express();


const PORT = process.env.PORT || 4000

app.use(express.json());
app.use("/", router);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  
})
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.log("MongoDB connection error:", err));

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
