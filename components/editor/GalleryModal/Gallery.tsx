import { FC } from "react";
import { BsCardImage } from "react-icons/bs";
import Image from "./Image";

interface ImageData {
  src: string;
  altText?: string;
  id?: string;
}

interface Props {
  images: ImageData[];
  onSelect(image: ImageData): void;
  uploading?: boolean;
  selectedImage?: string;
}

const Gallery: FC<Props> = ({
  images,
  uploading = false,
  selectedImage = "",
  onSelect,
}): JSX.Element => {
  if (!images || !Array.isArray(images)) {
    return <p className="text-center w-full text-gray-500 dark:text-gray-400">Invalid image data</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {/* Loading state khi đang fetch images */}
      {uploading && images.length === 0 && (
        <div className="col-span-full text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center animate-pulse">
            <BsCardImage size={32} className="text-gray-400 dark:text-gray-500" />
          </div>
          <p className="text-gray-500 dark:text-gray-400">Đang tải hình ảnh...</p>
        </div>
      )}

      {/* Empty state khi không có ảnh và không đang loading */}
      {images.length === 0 && !uploading && (
        <div className="col-span-full text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <BsCardImage size={32} className="text-gray-400 dark:text-gray-500" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 mb-2">Chưa có hình ảnh nào</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">Bạn có thể upload ảnh mới bằng cách chọn ảnh ở sidebar bên phải</p>
        </div>
      )}

      {/* Uploading indicator khi đang upload ảnh mới */}
      {uploading && images.length > 0 && (
        <div className="aspect-square flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-lg animate-pulse border-2 border-dashed border-blue-300 dark:border-blue-600">
          <BsCardImage size={40} />
          <p className="text-sm mt-2">Đang upload...</p>
        </div>
      )}

      {/* Hiển thị danh sách ảnh */}
      {images.map((image) => (
        <div key={image.src || image.id} className="gallery-item">
          <Image
            src={image.src}
            selected={selectedImage === image.src}
            onClick={() => onSelect(image)}
            alt={image.altText || "Gallery image"}
          />
        </div>
      ))}
    </div>
  );
};

export default Gallery;
