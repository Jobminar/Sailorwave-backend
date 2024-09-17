import Subadmin from "../sub-admin-model/subadmin.model.js";
import bcrypt from "bcrypt";
import {
  upload,
  uploadImageToS3,
  deleteImageFromS3,
} from "../../../utils/aws.image.js";
import jwt from "jsonwebtoken";
const subadminController = {
  createSubadmin: (req, res) => {
    upload(req, res, async (err) => {
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

        const imageUrl = await uploadImageToS3(file, "subadmin-images");
        const hashedPassword = await bcrypt.hash(password, 10);

        const newSubadmin = new Subadmin({
          name,
          mobile,
          email,
          password: hashedPassword,
          image: imageUrl,
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
        return res
          .status(400)
          .json({ message: "Required field is missing !!" });
      }
      const admin = await Subadmin.findOne({ email });

      if (!admin) {
        return res.status(404).json({ message: "admin email not found !!" });
      }
      const isValidPassword = await bcrypt.compare(password, admin.password);

      if (!isValidPassword) {
        return res
          .status(401)
          .json({ message: "Invalid password or wrong password" });
      }

      const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      res.status(200).json({ message: "Login successully admin", token });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to login", err: error.message });
    }
  },

  getAllSubadmins: async (req, res) => {
  
    try {
      const subadmin = await Subadmin.find();
      if (!subadmin) {
        return res.status(404).json({ message: "Subadmin not found" });
      }

      res.status(200).json(subadmin);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error retrieving subadmin", error: error.message });
    }
  },

  updateSubadmin: (req, res) => {
    upload(req, res, async (err) => {
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

        if (file) {
          const imageUrl = await uploadImageToS3(file, "subadmin-images");
          if (subadmin.image) {
            await deleteImageFromS3(subadmin.image);
          }
          subadmin.image = imageUrl;
        }

        subadmin.name = name || subadmin.name;
        subadmin.mobile = mobile || subadmin.mobile;
        subadmin.email = email || subadmin.email;
        subadmin.password = password || subadmin.password;

        await subadmin.save();
        res
          .status(200)
          .json({ message: "Subadmin updated successfully", subadmin });
      } catch (error) {
        res
          .status(500)
          .json({ message: "Error updating subadmin", error: error.message });
      }
    });
  },

  deleteSubadmin: async (req, res) => {
    const { id } = req.params;
    try {
      // Find the subadmin by ID
      const subadmin = await Subadmin.findById(id);
      if (!subadmin) {
        return res.status(404).json({ message: "Subadmin not found" });
      }
  
      // If the subadmin has an associated image, delete it from S3
      if (subadmin.image) {
        await deleteImageFromS3(subadmin.image);
      }
  
      // Delete the subadmin from the database
      await Subadmin.deleteOne({ _id: id });
  
      // Return a success message along with the deleted subadmin data
      res.status(200).json({ message: "Subadmin deleted successfully", subadmin });
    } catch (error) {
      // Handle errors and return a 500 status with the error message
      res.status(500).json({ message: "Error deleting subadmin", error: error.message });
    }
  },
  
};

export default subadminController;
