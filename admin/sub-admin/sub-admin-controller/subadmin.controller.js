import Subadmin from "../sub-admin-model/subadmin.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";

// In-memory storage using multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Utility function to convert image to base64
const convertToBase64 = (fileBuffer) => {
  return fileBuffer.toString("base64");
};

const subadminController = {
  createSubadmin: (req, res) => {
    upload.single('image')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }

      const { name, mobile, email, password } = req.body;
      const file = req.file;

      try {
        const existingSubadmin = await Subadmin.findOne({ email });
        if (existingSubadmin) {
          return res.status(400).json({ message: "Subadmin already exists" });
        }

        // Convert file to base64 if it exists
        const base64Image = file ? convertToBase64(file.buffer) : null;
        const hashedPassword = await bcrypt.hash(password, 10);

        const newSubadmin = new Subadmin({
          name,
          mobile,
          email,
          password: hashedPassword,
          image: base64Image, // Store base64 string in MongoDB
        });

        await newSubadmin.save();
        res
          .status(201)
          .json({
            message: "Subadmin created successfully",
            subadmin: newSubadmin._id,
          });
      } catch (error) {
        res
          .status(500)
          .json({ message: "Error creating subadmin", error: error.message });
      }
    });
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Required field is missing !!" });
      }
      const admin = await Subadmin.findOne({ email });

      if (!admin) {
        return res.status(404).json({ message: "Admin email not found !!" });
      }

      const isValidPassword = await bcrypt.compare(password, admin.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid password or wrong password" });
      }

      const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      res.status(200).json({ message: "Login successfully", token });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to login", err: error.message });
    }
  },

  getAllSubadmins: async (req, res) => {
    try {
      const subadmins = await Subadmin.find();
      if (!subadmins) {
        return res.status(404).json({ message: "Subadmin not found" });
      }

      res.status(200).json(subadmins);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving subadmins", error: error.message });
    }
  },

  updateSubadmin: (req, res) => {
    upload.single('image')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }

      const { id } = req.params;
      const { name, mobile, email, password } = req.body;
      const file = req.file;

      try {
        const subadmin = await Subadmin.findById(id);
        if (!subadmin) {
          return res.status(404).json({ message: "Subadmin not found" });
        }

        // If file is provided, convert it to base64
        if (file) {
          const base64Image = convertToBase64(file.buffer);
          subadmin.image = base64Image; // Update image in MongoDB
        }

        subadmin.name = name || subadmin.name;
        subadmin.mobile = mobile || subadmin.mobile;
        subadmin.email = email || subadmin.email;

        // If password is provided, hash it before updating
        if (password) {
          subadmin.password = await bcrypt.hash(password, 10);
        }

        await subadmin.save();
        res.status(200).json({ message: "Subadmin updated successfully", subadmin });
      } catch (error) {
        res.status(500).json({ message: "Error updating subadmin", error: error.message });
      }
    });
  },

  deleteSubadmin: async (req, res) => {
    const { id } = req.params;
    try {
      const subadmin = await Subadmin.findById(id);
      if (!subadmin) {
        return res.status(404).json({ message: "Subadmin not found" });
      }

      // Delete the subadmin from the database
      await Subadmin.deleteOne({ _id: id });

      res.status(200).json({ message: "Subadmin deleted successfully", subadmin });
    } catch (error) {
      res.status(500).json({ message: "Error deleting subadmin", error: error.message });
    }
  },
};

export default subadminController;
