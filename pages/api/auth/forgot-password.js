import db from "../../../utils/db";
import User from "../../../models/User";
import { forgotPasswordEmailTemplate } from "../../../emails/forgotPasswordEmailTemplate";
import { sendEmail } from "../../../utils/sendEmails";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await db.connectDb();

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email là bắt buộc" });
    }

    // Tìm user theo email
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy tài khoản với email này" });
    }

    // Tạo mã xác nhận 6 chữ số
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Lưu mã reset và thời gian hết hạn (15 phút)
    const resetExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 phút

    await User.findByIdAndUpdate(user._id, {
      resetPasswordToken: resetCode,
      resetPasswordExpires: resetExpires,
    });

     // Gửi email
     try {
       await sendEmail(
         user.email, 
         "", 
         "", 
         "Mã xác nhận đặt lại mật khẩu - BT Academy",
         forgotPasswordEmailTemplate(user.email, resetCode)
       );

      return res.status(200).json({
        message: "Mã xác nhận đã được gửi đến email của bạn",
        success: true,
      });
    } catch (emailError) {
      console.error("Lỗi gửi email:", emailError);
      return res.status(500).json({
        message: "Có lỗi xảy ra khi gửi email. Vui lòng thử lại sau.",
        success: false,
      });
    }
  } catch (error) {
    console.error("Lỗi forgot password:", error);
    return res.status(500).json({
      message: "Có lỗi xảy ra. Vui lòng thử lại sau.",
      success: false,
    });
  }
}
