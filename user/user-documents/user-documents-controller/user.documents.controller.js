import { upload, uploadImageToS3,deleteImageFromS3 } from "../../../utils/aws.config.js";
import UserDocuments from "../user-documents-model/user.documents.model.js";

const documentsController = {
  createDocuments: async (req, res) => {
    // Handle file uploads with multer
    upload(req, res, async (err) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Error uploading file", error: err });
      }

      // Extract files and userId from request
      const { image, tenthCertificates, adharCard } = req.files;
      const { userId } = req.body;

      // Validate if all required files and userId are provided
      if (!image || !tenthCertificates || !adharCard || !userId) {
        return res.status(400).json({ message: "Required fields are missing" });
      }

      try {
        // Upload each file to S3 and get the URL
        const imageUrl = await uploadImageToS3(image[0], "user-documents");
        const tenthCertificatesUrl = await uploadImageToS3(
          tenthCertificates[0],
          "user-documents"
        );
        const adharCardUrl = await uploadImageToS3(
          adharCard[0],
          "user-documents"
        );

        // Create new document entry
        const newDocuments = new UserDocuments({
          userId,
          image: imageUrl,
          tenthCertificates: tenthCertificatesUrl,
          adharCard: adharCardUrl,
        });

        // Save to database
        const savedDocuments = await newDocuments.save();
        res.status(201).json(savedDocuments);
      } catch (error) {
        console.error("Database save error:", error);
        res
          .status(500)
          .json({ message: "Internal server error", details: error });
      }
    });
  },
  getAllUserIdDocuments:async(req,res) => {
    try{
      const user=await UserDocuments.find()
      res.status(200).json(user)
    }
    catch(error){
        res.status(500).json({error:"Failed to get the data",err:error})
    }
  },

  getUserByIdDocuments: async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await UserDocuments.findOne({ userId });
      if (!user) {
        return res.status(400).json({ message: "user not found !!" });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to get the data", err: error });
    }
  },
  deleteDocuments: async (req, res) => {
    try {
      const { userId } = req.params;
  
      // Find the document by userId
      const document = await UserDocuments.findOne({ userId });
  
      if (!document) {
        return res.status(404).json({ message: "User documents not found" });
      }
  
      // Delete images from S3
      const { image, tenthCertificates, adharCard } = document;
      await Promise.all([
        deleteImageFromS3(image),
        deleteImageFromS3(tenthCertificates),
        deleteImageFromS3(adharCard)
      ]);
  
      // Delete the document from the database
      await UserDocuments.deleteOne({ userId });
  
      res.status(200).json({ message: "User documents deleted successfully" });
    } catch (error) {
      console.error("Delete error:", error);
      res.status(500).json({ message: "Internal server error", details: error });
    }
  }
  
};

export default documentsController;
