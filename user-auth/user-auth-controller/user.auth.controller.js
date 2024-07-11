import User from "../user-auth-model/user.auth.model.js";

const userController = {
 
 generateOtp : async (req, res) => {
        const { phone } = req.body;
      
        if (!phone) {
          return res.status(400).json({ message: "Phone number is required" });
        }
      
        const otp = Math.floor(100000 + Math.random() * 900000); 
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // OTP expires in 5 minutes
      
        try {
          const user = await User.findOneAndUpdate(
            { phone },
            { otp, otpExpiry },
            { upsert: true, new: true }
          );
      
          
          console.log(`Sending OTP ${otp} to phone number ${phone}`);
      
          return res.status(200).json({ message: "OTP sent successfully" });
        } catch (error) {
          return res.status(500).json({ message: "Internal Server Error" });
        }
      },

  verifyOtp: async (req, res) => {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ message: "Phone number and OTP are required" });
    }

    try {
      const user = await User.findOne({ phone });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.otp !== otp || user.otpExpiry < new Date()) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }

      
      user.otp = null; 
      user.otpExpiry = null;
      await user.save();

      return res.status(200).json({ message: "OTP verified successfully", user });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

export default userController;
