import Admitcard from "../user-admit-card-model/user.admit.card.model.js";

const admitCardController = {
  createAdmitCard: async (req, res) => {
    try {
      const {
        name,
        birthDate,
        gmail,
        applicationNumber,
        applicationStatus,
        dateOfApplied,
        dateOfInterview,
        timeOfInterview
      } = req.body;

    if (!name  ||
      !birthDate ||
      !gmail  ||
      !applicationNumber ||
      !applicationStatus  ||
      !dateOfApplied  ||
      !dateOfInterview ||
      !timeOfInterview) {
        return res.status(400).json({ message: "Required fields are missing !!" });
      }

      const newAdmitCard = new Admitcard({
        name,
        birthDate,
        gmail,
        applicationNumber,
        applicationStatus,
        dateOfApplied,
        dateOfInterview,
        timeOfInterview
      });

      await newAdmitCard.save();
      res.status(201).json({ message: "Successfully admit card data added" });
    } catch (error) {
      res.status(500).json({ error: "Internal server error", err: error.message });
    }
  },

  getApplicationNumberById:async(req,res) => {
    try{
      const {applicationNumber}=req.params

      const admit=await Admitcard.findOne({applicationNumber})
      if(!admit){
        return res.status(404).json({message:"admit card not found "})
      }
      res.status(200).json(admit)
    }
    catch(error){
      res.status(500).json({error:"Failed to get application",details:error})
    }
  },

  getAllAdmitCard:async(req,res) => {
    try{
      const admit=await Admitcard.find()
      if(admit.length===0){
        return res.status(400).json({message:"Data not available in data base"})
      }
      res.status(200).json(admit)
    }
    catch(error){
      res.status(500).json({error:"Failed to get the data"})
    }
  },

  deleteAdmitCard:async(req,res) => {
    try{
      const {id}=req.params
     const admit=await Admitcard.findByIdAndDelete(id)
     if(!admit){
      return res.status(404).json({message:"admitcard not found in this id !!"})
     }
     res.status(200).json({message:"deleted successfully"})
    }
    catch(error){
      res.status(500).json({error:"Failed to delete error",details:error})
    }
  }

};

export default admitCardController;
