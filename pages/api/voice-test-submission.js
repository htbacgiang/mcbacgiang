import multiparty from 'multiparty';
import nodemailer from 'nodemailer';

// Disable body parsing for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Parse form data using multiparty
    const form = new multiparty.Form({
      maxFileSize: 50 * 1024 * 1024, // 50MB limit
    });

    const result = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    const { fields, files } = result;
    const email = fields.email?.[0] || '';
    const phone = fields.phone?.[0] || '';
    const audioFile = files.audioFile?.[0];

    console.log('Parsed data:', { fields, files, email, phone, audioFile });

    // Validate required fields - chỉ cần email hoặc số điện thoại
    if (!email && !phone) {
      console.log('Validation failed: No email or phone provided');
      return res.status(400).json({ 
        message: 'Vui lòng cung cấp email hoặc số điện thoại' 
      });
    }

    if (!audioFile) {
      console.log('Validation failed: No audio file provided');
      return res.status(400).json({ 
        message: 'Vui lòng tải lên file audio' 
      });
    }

    // Generate unique filename for email attachment
    const timestamp = Date.now();
    const fileExtension = audioFile.originalFilename ? 
      audioFile.originalFilename.split('.').pop() : 'wav';
    const fileName = `voice-test-${timestamp}.${fileExtension}`;

    // Send email notification with file attachment
    await sendEmailNotification({
      email: email,
      phone: phone,
      fileName: fileName,
      filePath: audioFile.path, // Use temporary file path
      originalFilename: audioFile.originalFilename || fileName,
    });

    // Clean up temporary file
    try {
      const fs = require('fs');
      fs.unlinkSync(audioFile.path);
    } catch (cleanupError) {
      console.warn('Could not clean up temporary file:', cleanupError);
    }

    // Save submission record (optional - you can add to database here)
    const submissionData = {
      email: email,
      phone: phone,
      fileName: fileName,
      submittedAt: new Date().toISOString(),
    };

    // You can save to database here if needed
    console.log('Voice test submission:', submissionData);

    res.status(200).json({ 
      message: 'Bài test giọng đã được gửi thành công!',
      submissionId: timestamp
    });

  } catch (error) {
    console.error('Error processing voice test submission:', error);
    res.status(500).json({ 
      message: 'Có lỗi xảy ra khi xử lý bài test. Vui lòng thử lại.' 
    });
  }
}

async function sendEmailNotification({ email, phone, fileName, filePath, originalFilename }) {
  try {
    // Configure email transporter (using Gmail as example)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS, // Your app password
      },
    });

    const contactInfo = email ? `Email: ${email}` : `Số điện thoại: ${phone}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER, // Admin email
      subject: `Bài Test Giọng MC Mới từ ${email || phone} - BT Academy`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Bài Test Giọng MC Mới</h2>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e40af; margin-top: 0;">Thông tin người đăng ký:</h3>
            <p><strong>${contactInfo}</strong></p>
            <p><strong>Thời gian gửi:</strong> ${new Date().toLocaleString('vi-VN')}</p>
          </div>

          <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #92400e; margin-top: 0;">File Audio:</h4>
            <p><strong>Tên file gốc:</strong> ${originalFilename}</p>
            <p><strong>File đính kèm:</strong> ${fileName}</p>
          </div>

          <div style="background-color: #ecfdf5; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #065f46; margin-top: 0;">Hướng dẫn xử lý:</h4>
            <p>1. <strong>Tải file audio</strong> đính kèm về để nghe và đánh giá</p>
            <p>2. <strong>Liên hệ ngay</strong> với người đăng ký qua ${contactInfo}</p>
            <p>3. <strong>Tư vấn</strong> và đưa ra lộ trình phát triển giọng nói</p>
            <p>4. <strong>Cập nhật</strong> kết quả đánh giá trong hệ thống</p>
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #6b7280; font-size: 14px;">
              Email này được gửi tự động từ hệ thống BT Academy
            </p>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: fileName,
          path: filePath,
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    console.log('Email notification sent successfully to admin');

  } catch (error) {
    console.error('Error sending email notification:', error);
    // Don't throw error here to avoid breaking the main flow
  }
}
