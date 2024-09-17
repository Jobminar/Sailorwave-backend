import UserAddress from '../user-address-model/user.address.models.js'

const userAddressController = {
  // Create a new user address
  createUserAddress: async (req, res) => {
    const { userId, houseNo, policeStation, postOffice, district, city, state, pincode } = req.body;
    try {
      const newUserAddress = new UserAddress({
        userId,
        houseNo,
        policeStation,
        postOffice,
        district,
        city,
        state,
        pincode,
      });

      await newUserAddress.save();
      res.status(201).json({ message: 'User address created successfully', address: newUserAddress });
    } catch (error) {
      res.status(500).json({ message: 'Error creating user address', error: error.message });
    }
  },

  getAllUserAddress: async(req,res) =>{

  try{
    const address=await UserAddress.find()
    res.status(200).json(address)
  }
  catch(error){
   res.status(500).json({error:"Failed to get data",err:error})
  }

  },

  // Get a user address by ID
  getUserAddressById: async (req, res) => {
    const { userId } = req.params;
    try {
      const address = await UserAddress.find({userId});
      if (!address) {
        return res.status(404).json({ message: 'User address not found' });
      }

      res.status(200).json(address);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving user address', error: error.message });
    }
  },

  // Update a user address
  updateUserAddress: async (req, res) => {
    const { id } = req.params;
    const updates=req.body
    try {
      const address = await UserAddress.findByIdAndUpdate(id,updates,{
        new:true,
        runValidators:true
      })
      
      if (!address) {
        return res.status(404).json({ message: 'User address not found' });
      }

      res.status(200).json({ message: 'User address updated successfully', address });
    } catch (error) {
      res.status(500).json({ message: 'Error updating user address', error: error.message });
    }
  },

  // Delete a user address
  deleteUserAddress: async (req, res) => {
    const { id } = req.params;
    try {
      const address = await UserAddress.findById(id);
      if (!address) {
        return res.status(404).json({ message: 'User address not found' });
      }

      res.status(200).json({ message: 'User address deleted successfully',address });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting user address', error: error.message });
    }
  },
};

export default userAddressController;
