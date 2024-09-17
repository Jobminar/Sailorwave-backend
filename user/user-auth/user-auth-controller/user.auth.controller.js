import User from "../user-auth-model/user.auth.model.js";

const userController = {
  generateOtp: async (req, res) => {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    const otp = Math.floor(1000 + Math.random() * 9000); 
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // Set OTP expiry time to 5 minutes from now

    try {
      const user = await User.findOneAndUpdate(
        { phone },
        { otp, otpExpiry },
        { upsert: true, new: true }
      );

      return res.status(200).json({ message: "OTP sent successfully",otp:otp });
    } catch (error) {
      console.error("Error generating OTP:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
  verifyOtp: async (req, res) => {
    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({ message: "OTP is required" });
    }

    try {
      const user = await User.findOne({ otp });

      if (!user) {
        return res.status(404).json({ message: "Invalid or expired OTP" });
      }

      if (user.otpExpiry < new Date()) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }
      user.otp = null; 
      user.otpExpiry = null;
      await user.save();

      return res.status(200).json({ message: "OTP verified successfully", phone:user.phone,userId:user._id });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
}

};

export default userController;
