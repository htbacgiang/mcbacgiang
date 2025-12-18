import React from 'react';
import { ScrollingGallery } from '../gallery';

const GallerySection = ({ 
  title = "Hình ảnh hoạt động tại BT Academy",
  subtitle = "Khám phá những khoảnh khắc đáng nhớ trong quá trình đào tạo và phát triển của các học viên tại BT Academy",
  className = "",
  showTitle = true
}) => {
  return (
    <section className={`py-4 ${className}`}>  
      {showTitle && (
        <div className="container mx-auto px-2 text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          <p className="text-gray-600 text-lg max-w-5xl mx-auto">
            {subtitle}
          </p>
        </div>
      )}
      
      <ScrollingGallery />
    </section>
  );
};

export default GallerySection;
