import type { NextApiHandler } from "next";
import { IncomingForm } from "formidable";
import cloudinary from "../../lib/cloudinary";
import db from "../../utils/db";
import Image from "../../models/Image";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { getToken } from "next-auth/jwt";

// Tắt bodyParser để formidable xử lý request
export const config = {
  api: { bodyParser: false },
};

// Hàm tiện ích để parse form multipart/form-data, hỗ trợ multiples
const parseForm = (req: any): Promise<{ files: any; fields: any }> => {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm({ 
      multiples: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
      maxFields: 100,
      maxFieldsSize: 2 * 1024 * 1024, // 2MB cho fields
    });
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ files, fields });
    });
  });
};

const handler: NextApiHandler = (req, res) => {
  const { method } = req;
  switch (method) {
    case "POST": {
      const { multiple, type, action } = req.query;
      if (action === "migrate") {
        return migrateImages(req, res);
      }
      if (type === "avatar") {
        return uploadAvatar(req, res);
      }
      if (multiple === "true") {
        return uploadMultipleImages(req, res);
      }
      return uploadNewImage(req, res);
    }

    case "GET":
      return readAllImages(req, res);
    default:
      return res.status(404).send("Not found!");
  }
};

// Upload một ảnh lên Cloudinary
const uploadNewImage: NextApiHandler = async (req, res) => {
  let dbConnected = false;
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const session = token ? { user: token } : null;
    if (!session || !session.user || !(session.user as any).sub) {
      return res.status(401).json({ error: "Bạn cần đăng nhập để upload ảnh!" });
    }

    const { files, fields } = await parseForm(req);
    const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;
    const altText = fields.altText || "";

    // Validate loại file
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(imageFile.mimetype)) {
      return res.status(400).json({ error: 'Chỉ hỗ trợ file JPEG, JPG, PNG, WEBP' });
    }

    // Validate kích thước file (tối đa 10MB)
    const maxFileSize = 10 * 1024 * 1024; // 10MB
    if (imageFile.size > maxFileSize) {
      return res.status(400).json({ error: 'Kích thước file không được vượt quá 10MB' });
    }

    const folder = process.env.CLOUDINARY_FOLDER || "mcbacgiang";
    const { secure_url: url, public_id } = await cloudinary.uploader.upload(
      imageFile.filepath,
      { folder }
    );

    // Lưu thông tin ảnh vào database
    await db.connectDb();
    dbConnected = true;
    const newImage = new Image({
      src: url,
      altText,
      publicId: public_id,
      uploadedBy: (session.user as any).sub,
      folder,
    });
    await newImage.save();

    console.log(`[uploadNewImage] Image uploaded successfully:`, {
      url,
      public_id,
      id: newImage._id.toString(),
      folder
    });

    res.json({ 
      src: url, 
      altText: altText || "", 
      id: newImage._id.toString() 
    });
  } catch (error: any) {
    console.error('Error uploading to Cloudinary:', error);
    res.status(500).json({ error: error.message });
  } finally {
    if (dbConnected) {
      try {
        await db.disconnectDb();
      } catch (disconnectError) {
        console.error('Error disconnecting from database:', disconnectError);
      }
    }
  }
};

// Upload avatar lên Cloudinary
const uploadAvatar: NextApiHandler = async (req, res) => {
  try {
    const { files } = await parseForm(req);
    const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;

    // Validate loại file
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(imageFile.mimetype)) {
      return res.status(400).json({ error: 'Chỉ hỗ trợ file JPEG, JPG, PNG, WEBP' });
    }

    // Validate kích thước file (tối đa 5MB)
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    if (imageFile.size > maxFileSize) {
      return res.status(400).json({ error: 'Kích thước file không được vượt quá 5MB' });
    }

    const { secure_url: url } = await cloudinary.uploader.upload(
      imageFile.filepath,
      { folder: `${process.env.CLOUDINARY_FOLDER || "mcbacgiang"}/avatar` }
    );

    res.json({ src: url });
  } catch (error: any) {
    console.error('Error uploading avatar to Cloudinary:', error);
    res.status(500).json({ error: error.message });
  }
};

// Upload nhiều ảnh lên Cloudinary cùng lúc
const uploadMultipleImages: NextApiHandler = async (req, res) => {
  try {
    const { files } = await parseForm(req);
    const imageFiles = Array.isArray(files.image) ? files.image : [files.image];
    const uploadedUrls: string[] = [];

    // Validate và upload từng file
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxFileSize = 10 * 1024 * 1024; // 10MB
    for (const file of imageFiles) {
      if (!allowedTypes.includes(file.mimetype)) {
        return res.status(400).json({ error: 'Chỉ hỗ trợ file JPEG, JPG, PNG, WEBP' });
      }
      if (file.size > maxFileSize) {
        return res.status(400).json({ error: 'Kích thước file không được vượt quá 10MB' });
      }
      const { secure_url: url } = await cloudinary.uploader.upload(
        file.filepath,
        { folder: process.env.CLOUDINARY_FOLDER || "mcbacgiang" }
      );
      uploadedUrls.push(url);
    }

    res.json({ src: uploadedUrls });
  } catch (error: any) {
    console.error('Error uploading multiple images to Cloudinary:', error);
    res.status(500).json({ error: error.message });
  }
};



// Helper function để kiểm tra ảnh với timeout
const checkImageExists = async (publicId: string, timeoutMs: number = 5000): Promise<boolean> => {
  return Promise.race([
    cloudinary.api.resource(publicId).then(() => true).catch(() => false),
    new Promise<boolean>((resolve) => setTimeout(() => resolve(false), timeoutMs))
  ]);
};

// Đọc danh sách ảnh đã upload từ Cloudinary
const readAllImages: NextApiHandler = async (req, res) => {
  let dbConnected = false;
  try {
    await db.connectDb();
    dbConnected = true;
    const currentFolder = process.env.CLOUDINARY_FOLDER || "mcbacgiang";
    
    console.log(`[readAllImages] Fetching images from folder: ${currentFolder}`);
    
    // Lấy ảnh từ database theo folder hiện tại
    let images = await Image.find({ folder: currentFolder }).sort({ createdAt: -1 });
    console.log(`[readAllImages] Found ${images.length} images in database for folder: ${currentFolder}`);
    
    // Nếu không có ảnh trong folder hiện tại, thử tìm trong các folder khác
    if (images.length === 0) {
      console.log(`[readAllImages] No images in ${currentFolder}, checking other folders...`);
      const allImages = await Image.find({}).sort({ createdAt: -1 }).limit(100);
      console.log(`[readAllImages] Found ${allImages.length} total images in database`);
      
      // Nếu có ảnh trong folder khác, lấy chúng
      if (allImages.length > 0) {
        images = allImages;
        console.log(`[readAllImages] Using images from other folders`);
      } else {
        // Nếu database hoàn toàn trống, thử lấy từ Cloudinary trực tiếp
        console.log(`[readAllImages] Database is empty, trying to fetch from Cloudinary...`);
        try {
          const cloudinaryResponse = await cloudinary.api.resources({
            resource_type: "image",
            type: "upload",
            prefix: currentFolder,
            max_results: 100,
          });
          
          if (cloudinaryResponse.resources && cloudinaryResponse.resources.length > 0) {
            console.log(`[readAllImages] Found ${cloudinaryResponse.resources.length} images in Cloudinary`);
            // Trả về ảnh từ Cloudinary
            const cloudinaryImages = cloudinaryResponse.resources.map((resource: any) => ({
              src: resource.secure_url,
              altText: "",
              id: resource.public_id
            }));
            return res.json({ images: cloudinaryImages });
          }
        } catch (cloudinaryError: any) {
          console.error(`[readAllImages] Error fetching from Cloudinary:`, cloudinaryError.message);
        }
      }
    }
    
    // Trả về ảnh ngay từ database mà không cần kiểm tra Cloudinary mỗi lần
    // Việc kiểm tra Cloudinary có thể làm chậm và không cần thiết cho mỗi request
    const validImages = images.map((img) => ({
      src: img.src,
      altText: img.altText || "",
      id: img._id.toString()
    }));
    
    console.log(`[readAllImages] Returning ${validImages.length} images`);
    
    res.json({ images: validImages });
  } catch (error: any) {
    console.error('[readAllImages] Error fetching images from database:', error);
    console.error('[readAllImages] Error details:', error.stack);
    // Trả về mảng rỗng thay vì lỗi để UI vẫn có thể hoạt động
    res.status(200).json({ images: [] });
  } finally {
    if (dbConnected) {
      try {
        await db.disconnectDb();
      } catch (disconnectError) {
        console.error('[readAllImages] Error disconnecting from database:', disconnectError);
      }
    }
  }
};

// Migrate ảnh từ folder btacademy sang mcbacgiang
const migrateImages: NextApiHandler = async (req, res) => {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const session = token ? { user: token } : null;
    if (!session || !session.user || !(session.user as any).sub) {
      return res.status(401).json({ error: "Bạn cần đăng nhập để migrate ảnh!" });
    }

    await db.connectDb();
    const sourceFolder = "btacademy";
    const targetFolder = process.env.CLOUDINARY_FOLDER || "mcbacgiang";

    // Lấy tất cả ảnh từ Cloudinary folder btacademy
    let cloudinaryResources: any[] = [];
    try {
      const result = await cloudinary.api.resources({
        type: 'upload',
        prefix: sourceFolder,
        max_results: 500,
      });
      cloudinaryResources = result.resources || [];
      // Sắp xếp theo thời gian tạo (mới nhất trước)
      cloudinaryResources.sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return dateB - dateA;
      });
      console.log(`Found ${cloudinaryResources.length} images in Cloudinary folder ${sourceFolder}`);
    } catch (error: any) {
      console.error('Error fetching from Cloudinary:', error);
    }

    // Lấy ảnh từ database folder btacademy
    const dbImages = await Image.find({ folder: sourceFolder });
    console.log(`Found ${dbImages.length} images in database folder ${sourceFolder}`);

    const migratedImages = [];
    const failedImages = [];
    const processedPublicIds = new Set<string>();

    // Xử lý ảnh từ Cloudinary
    for (const resource of cloudinaryResources) {
      try {
        const publicId = resource.public_id;
        if (processedPublicIds.has(publicId)) continue;
        processedPublicIds.add(publicId);

        // Nếu ảnh đã ở folder đúng thì chỉ cần cập nhật database
        if (resource.folder === targetFolder) {
          const existingImg = await Image.findOne({ publicId });
          if (existingImg) {
            existingImg.folder = targetFolder;
            await existingImg.save();
          } else {
            // Tạo record mới trong database
            const newImage = new Image({
              src: resource.secure_url,
              altText: "",
              publicId: publicId,
              uploadedBy: (session.user as any).sub,
              folder: targetFolder,
            });
            await newImage.save();
          }
          migratedImages.push(publicId);
          continue;
        }

        // Move ảnh sang folder mới
        const publicIdWithoutFolder = publicId.split('/').pop();
        const newPublicId = `${targetFolder}/${publicIdWithoutFolder}`;

        const renameResult = await cloudinary.uploader.rename(publicId, newPublicId);
        
        // Cập nhật hoặc tạo record trong database
        const existingImg = await Image.findOne({ publicId: publicId });
        if (existingImg) {
          existingImg.publicId = newPublicId;
          existingImg.src = renameResult.secure_url;
          existingImg.folder = targetFolder;
          await existingImg.save();
        } else {
          const newImage = new Image({
            src: renameResult.secure_url,
            altText: "",
            publicId: newPublicId,
            uploadedBy: (session.user as any).sub,
            folder: targetFolder,
          });
          await newImage.save();
        }
        
        migratedImages.push(newPublicId);
        console.log(`Migrated: ${publicId} -> ${newPublicId}`);
      } catch (error: any) {
        console.error(`Failed to migrate ${resource.public_id}:`, error.message);
        failedImages.push({ publicId: resource.public_id, error: error.message });
      }
    }

    // Xử lý ảnh từ database chưa được xử lý
    for (const img of dbImages) {
      if (processedPublicIds.has(img.publicId)) continue;
      
      try {
        const resource = await cloudinary.api.resource(img.publicId);
        
        if (resource.folder === targetFolder) {
          img.folder = targetFolder;
          await img.save();
          migratedImages.push(img.publicId);
          continue;
        }

        const publicIdWithoutFolder = img.publicId.split('/').pop();
        const newPublicId = `${targetFolder}/${publicIdWithoutFolder}`;

        const renameResult = await cloudinary.uploader.rename(img.publicId, newPublicId);
        
        img.publicId = newPublicId;
        img.src = renameResult.secure_url;
        img.folder = targetFolder;
        await img.save();
        
        migratedImages.push(newPublicId);
        console.log(`Migrated from DB: ${img.publicId} -> ${newPublicId}`);
      } catch (error: any) {
        console.error(`Failed to migrate ${img.publicId}:`, error.message);
        failedImages.push({ publicId: img.publicId, error: error.message });
        
        // Nếu ảnh không tồn tại trên Cloudinary, xóa khỏi database
        if (error.http_code === 404) {
          await Image.findByIdAndDelete(img._id);
        }
      }
    }

    res.json({
      success: true,
      message: `Đã migrate ${migratedImages.length} ảnh từ ${sourceFolder} sang ${targetFolder}`,
      migrated: migratedImages.length,
      failed: failedImages.length,
      failedImages: failedImages.slice(0, 10), // Chỉ trả về 10 lỗi đầu tiên
    });
  } catch (error: any) {
    console.error('Error migrating images:', error);
    res.status(500).json({ error: error.message });
  }
};

export default handler;