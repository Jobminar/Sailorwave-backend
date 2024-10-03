import multer from "multer";
import path from "path";
import UserDocuments from "../user-documents-model/user.documents.model.js";

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory to store files locally
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

// Multer middleware for handling file uploads
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB limit
  fileFilter: fileFilter
}).fields([
  { name: 'image', maxCount: 1 },
  { name: 'tenthCertificates', maxCount: 1 },
  { name: 'adharCard', maxCount: 1 }
]);

// Controller methods
const documentsController = {
  // Create new user document
  createDocuments: async (req, res) => {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ message: "Error uploading files", error: err });
      }

      const { image, tenthCertificates, adharCard } = req.files;
      const { userId } = req.body;

      if (!image || !tenthCertificates || !adharCard || !userId) {
        return res.status(400).json({ message: "Required fields are missing" });
      }

      try {
        const imageUrl = `/uploads/${image[0].filename}`;
        const tenthCertificatesUrl = `/uploads/${tenthCertificates[0].filename}`;
        const adharCardUrl = `/uploads/${adharCard[0].filename}`;

        const newDocuments = new UserDocuments({
          userId,
          image: imageUrl,
          tenthCertificates: tenthCertificatesUrl,
          adharCard: adharCardUrl,
        });

        const savedDocuments = await newDocuments.save();
        res.status(201).json(savedDocuments);
      } catch (error) {
        console.error("Database save error:", error);
        res.status(500).json({ message: "Internal server error", details: error });
      }
    });
  },

  // Retrieve all documents
  getAllUserIdDocuments: async (req, res) => {
    try {
      const users = await UserDocuments.find();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve documents", details: error });
    }
  },

  // Retrieve documents by user ID
  getUserByIdDocuments: async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await UserDocuments.findOne({ userId });
      if (!user) {
        return res.status(404).json({ message: "User documents not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve documents", details: error });
    }
  },

  // Delete documents by user ID
  deleteDocuments: async (req, res) => {
    try {
      const { userId } = req.params;
      const document = await UserDocuments.findOne({ userId });
      if (!document) {
        return res.status(404).json({ message: "User documents not found" });
      }

      // Optionally delete the files from the local file system here

      await UserDocuments.deleteOne({ userId });
      res.status(200).json({ message: "User documents deleted successfully" });
    } catch (error) {
      console.error("Delete error:", error);
      res.status(500).json({ message: "Internal server error", details: error });
    }
  }
};

export default documentsController;
