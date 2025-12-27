import type { NextApiHandler } from "next";
import { IncomingForm } from "formidable";
import { v2 as cloudinary } from "cloudinary";

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Hàm tiện ích để parse form multipart/form-data
const parseForm = (req: any): Promise<{ files: any }> => {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm({ 
      multiples: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
      maxFields: 100,
      maxFieldsSize: 2 * 1024 * 1024, // 2MB cho fields
    });
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ files });
    });
  });
};

const getImages: NextApiHandler = async (req, res) => {
  try {
    const response = await cloudinary.api.resources({
      resource_type: "image",
      max_results: 200,
      prefix: "btacademy",
    });
    res.json({ images: response.resources });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
const readAllImages: NextApiHandler = async (req, res) => {
    try {
      // Tương tự, không cần kiểm tra admin tại API
      const { resources } = await cloudinary.api.resources({
        resource_type: "image",
        type: "upload",
        prefix: process.env.CLOUDINARY_FOLDER || "btacademy",
        max_results: 1000,
      });
  
      const images = resources.map(({ secure_url }: any) => ({
        src: secure_url,
      }));
      res.json({ images });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
  
const uploadNewImage: NextApiHandler = async (req, res) => {
  try {
    const { files } = await parseForm(req);
    const imageFiles = Array.isArray(files.image) ? files.image : [files.image];
    const uploadedUrls: string[] = [];

    // Validate loại file và kích thước
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxFileSize = 10 * 1024 * 1024; // 10MB
    
    for (const imageFile of imageFiles) {
      if (!allowedTypes.includes(imageFile.mimetype)) {
        return res.status(400).json({ error: 'Chỉ hỗ trợ file JPEG, JPG, PNG, WEBP' });
      }
      if (imageFile.size > maxFileSize) {
        return res.status(400).json({ error: 'Kích thước file không được vượt quá 10MB' });
      }
      
      const { secure_url: url } = await cloudinary.uploader.upload(
        imageFile.filepath,
        { folder: process.env.CLOUDINARY_FOLDER || "mcbacgiang" }
      );
      uploadedUrls.push(url);
    }

    res.json({ src: uploadedUrls });
  } catch (error: any) {
    console.error('Error uploading to Cloudinary:', error);
    res.status(500).json({ error: error.message });
  }
};

const handler: NextApiHandler = (req, res) => {
  if (req.method === "GET") return getImages(req, res);
  if (req.method === "POST") return uploadNewImage(req, res);
  res.status(405).json({ error: "Method not allowed" });
};

export const config = {
  api: {
    bodyParser: false, // Tắt bodyParser để formidable xử lý request
  },
};

export default handler;