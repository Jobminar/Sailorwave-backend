import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
  },
  tls: { rejectUnauthorized: false },
});

const generateOtp = Math.floor(10000000000 + Math.random() * 90000000000);

const sendEmailOtp = async (email, otp) => {
  try {
    await transport.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Forgot your password otp",
      text: `Your otp is ${otp}.it will expires in 5 min`,
    });
    console.log("otp sent successfully");
  } catch (error) {
    console.log(error);
  }
};