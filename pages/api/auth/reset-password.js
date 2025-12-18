import db from "../../../utils/db";
import User from "../../../models/User";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await db.connectDb();

    const { email, resetCode, newPassword } = req.body;

    if (!email || !resetCode || !newPassword) {
      return res.status(400).json({ 
        message: "Email, mã xác nhận và mật khẩu mới là bắt buộc" 
      });
    }

    // Tìm user theo email
    const user = await User.findOne({ 
      email: email.toLowerCase(),
      resetPasswordToken: resetCode,
      resetPasswordExpires: { $gt: new Date() } // Kiểm tra mã còn hiệu lực
    });

    if (!user) {
      return res.status(400).json({ 
        message: "Mã xác nhận không hợp lệ hoặc đã hết hạn" 
      });
    }

    // Kiểm tra độ mạnh mật khẩu
    if (newPassword.length < 6) {
      return res.status(400).json({ 
        message: "Mật khẩu phải có ít nhất 6 ký tự" 
      });
    }

    // Mã hóa mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Cập nhật mật khẩu và xóa mã reset
    await User.findByIdAndUpdate(user._id, {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });

    return res.status(200).json({
      message: "Mật khẩu đã được đặt lại thành công",
      success: true,
    });
  } catch (error) {
    console.error("Lỗi reset password:", error);
    return res.status(500).json({
      message: "Có lỗi xảy ra. Vui lòng thử lại sau.",
      success: false,
    });
  }
}
