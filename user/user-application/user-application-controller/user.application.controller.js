import UserApplication from '../user-application-model/user.application.model.js';

const userApplicationController = {

  createUserApplication: async (req, res) => {
    const { userId, mobile, candidateName, fatherName, dateOfBirth, gender, email, isVerify } = req.body;
    
   
    const applicationNumber = Math.floor(10000000000 + Math.random() * 90000000000); 

    try {
      const newUser = new UserApplication({
        applicationNumber, 
        userId,
        mobile,
        candidateName,
        fatherName,
        dateOfBirth,
        gender,
        email,
        isVerify: isVerify || false, 
      });

      await newUser.save();
      res.status(201).json({ message: 'User application created successfully', user: newUser });
    } catch (error) {
      res.status(500).json({ message: 'Error creating user application', error: error.message });
    }
  },

  getAllUserApplications: async (req, res) => {
    try {
      const users = await UserApplication.find();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve user applications', error: error.message });
    }
  },


  getUserApplicationById: async (req, res) => {
    const { id } = req.params;
    try {
      const user = await UserApplication.findById(id);
      if (!user) {
        return res.status(404).json({ message: 'User application not found' });
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving user application', error: error.message });
    }
  },
  getUserApplicationByUserId: async(req, res) =>{
    try{
    const {userId} =req.params
    const user=await UserApplication.find({userId})

    if(!user){
      return res.status(404).json({message:"userId not found !!"})
    }
    res.status(200).json(user)
    }
    catch(error){
      res.status(500).json({error:"Failed to get data",err:error.message})
    }
  },

  updateUserApplication: async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    try {

      const user = await UserApplication.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
        context: 'query', 
      });

      if (!user) {
        return res.status(404).json({ message: 'User application not found' });
      }

      res.status(200).json({ message: 'User application updated successfully', user });
    } catch (error) {
      res.status(400).json({ message: 'Error updating user application', error: error.message });
    }
  },


  deleteUserApplication: async (req, res) => {
    const { id } = req.params;
    try {
      const user = await UserApplication.findById(id);
      if (!user) {
        return res.status(404).json({ message: 'User application not found' });
      }

      await user.deleteOne();
      res.status(200).json({ message: 'User application deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting user application', error: error.message });
    }
  },
};

export default userApplicationController;
