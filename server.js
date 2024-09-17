import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import router from "./router/index.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT;

app.use(express.json());

app.use("/", router);

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("mongodb connected successfully"))
  .catch((err) => console.log("mongodb connection error", err));

app.listen(PORT, () => console.log(`Server running on port:${PORT}`));
