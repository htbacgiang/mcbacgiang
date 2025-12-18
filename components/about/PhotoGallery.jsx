import React, { useState } from 'react';
import { 
  FaCamera, 
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaExpand,
  FaHeart,
  FaShare
} from 'react-icons/fa';

const PhotoGallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filter, setFilter] = useState('all');

  const galleryData = [
    {
      id: 1,
      src: "/images/gallery/bt-01.jpg",
      alt: "MC Bích Thủy - Ảnh 1",
      category: "events"
    },
    {
      id: 2,
      src: "/images/gallery/bt-02.jpg",
      alt: "MC Bích Thủy - Ảnh 2",
      category: "events"
    },
    {
      id: 3,
      src: "/images/gallery/bt-03.jpg",
      alt: "MC Bích Thủy - Ảnh 3",
      category: "tv"
    },
    {
      id: 4,
      src: "/images/gallery/bt-04.jpg",
      alt: "MC Bích Thủy - Ảnh 4",
      category: "events"
    },
    {
      id: 5,
      src: "/images/gallery/bt-05.jpg",
      alt: "MC Bích Thủy - Ảnh 5",
      category: "events"
    },
    {
      id: 6,
      src: "/images/gallery/bt-06.jpg",
      alt: "MC Bích Thủy - Ảnh 6",
      category: "events"
    },
    {
      id: 7,
      src: "/images/gallery/bt-07.jpg",
      alt: "MC Bích Thủy - Ảnh 7",
      category: "events"
    },
    {
      id: 8,
      src: "/images/gallery/bt-08.jpg",
      alt: "MC Bích Thủy - Ảnh 8",
      category: "events"
    },
    {
      id: 10,
      src: "/images/gallery/bt-10.jpg",
      alt: "MC Bích Thủy tại sự kiện Vinh danh Thương hiệu",
      category: "events"
    },
    {
      id: 11,
      src: "/images/gallery/bt-11.jpg",
      alt: "MC Bích Thủy tại BT Academy",
      category: "events"
    },
    {
      id: 12,
      src: "/images/gallery/bt-12.jpg",
      alt: "MC Bích Thủy cùng MC Quyền Linh",
      category: "events"
    },
    {
      id: 13,
      src: "/images/gallery/bt-13.jpg",
      alt: "MC Bích Thủy tại VTC10",
      category: "tv"
    },
  
    {
      id: 15,
      src: "/images/gallery/bt-15.jpg",
      alt: "MC Bích Thủy tại gala Inox Hoàng Vũ",
      category: "teaching"
    },
    {
      id: 16,
      src: "/images/gallery/bt-16.jpg",
      alt: "MC Bích Thủy - Ảnh 16",
      category: "tv"
    },
    {
      id: 17,
      src: "/images/gallery/bt-17.jpg",
      alt: "MC Bích Thủy - Ảnh 17",
      category: "tv"
    },
    {
      id: 18,
      src: "/images/gallery/bt-18.jpg",
      alt: "MC Bích Thủy - Ảnh 18",
      category: "tv"
    },
    {
      id: 19,
      src: "/images/gallery/bt-19.jpg",
      alt: "MC Bích Thủy - Ảnh 19",
      category: "events"
    },
    {
      id: 20,
      src: "/images/gallery/bt-20.jpg",
      alt: "MC Bích Thủy - Ảnh 20",
      category: "events"
    },
    {
      id: 21,
      src: "/images/gallery/bt-21.jpg",
      alt: "MC Bích Thủy - Ảnh 21",
      category: "events"
    },
    {
      id: 21,
      src: "/images/gallery/hoc-vien-bt-08.jpg",
      alt: "MC Bích Thủy - Ảnh 21",
      category: "teaching"
    }
  ];

  const categories = [
    { key: 'all', label: 'Tất cả', count: galleryData.length },
    { key: 'events', label: 'Sự kiện', count: galleryData.filter(item => item.category === 'events').length },
    { key: 'tv', label: 'Truyền hình', count: galleryData.filter(item => item.category === 'tv').length },
    { key: 'teaching', label: 'Giảng dạy', count: galleryData.filter(item => item.category === 'teaching').length },
  ];

  const filteredImages = filter === 'all' 
    ? galleryData 
    : galleryData.filter(item => item.category === filter);

  const openLightbox = (image, index) => {
    setSelectedImage(image);
    setCurrentIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    const nextIndex = (currentIndex + 1) % filteredImages.length;
    setCurrentIndex(nextIndex);
    setSelectedImage(filteredImages[nextIndex]);
  };

  const prevImage = () => {
    const prevIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
    setCurrentIndex(prevIndex);
    setSelectedImage(filteredImages[prevIndex]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  };

  // Add keyboard event listener
  React.useEffect(() => {
    if (selectedImage) {
      document.addEventListener('keydown', handleKeyPress);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      document.body.style.overflow = 'unset';
    };
  }, [selectedImage, currentIndex]);

  return (
    <div className="bg-gradient-to-br from-white via-gray-50 to-gray-100 py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <FaCamera className="text-green-600 text-3xl mr-3" />
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Gallery MC Bích Thủy
            </h2>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Những khoảnh khắc đáng nhớ trong sự nghiệp MC và các hoạt động của Bích Thủy
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category.key}
              onClick={() => setFilter(category.key)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                filter === category.key
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-green-50 hover:text-green-600 shadow-md'
              }`}
            >
              {category.label} ({category.count})
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
          {filteredImages.map((image, index) => (
            <div
              key={image.id}
              className="group relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
              onClick={() => openLightbox(image, index)}
            >
              {/* Image */}
              <div className="relative md:h-48 h-32 overflow-hidden">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  onError={(e) => {
                    e.target.src = `https://images.unsplash.com/photo-1594736797933-d0300ba38463?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80`;
                  }}
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                  <div className="transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <FaExpand className="text-white text-2xl" />
                  </div>
                </div>

                {/* Category Badge */}
                <div className="absolute md:top-3 top-1 md:left-3 left-1">
                  <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                    {categories.find(cat => cat.key === image.category)?.label}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
            {/* Navigation Buttons */}
            <button
              onClick={prevImage}
              className="absolute left-6 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10 bg-black bg-opacity-50 rounded-full p-3 hover:bg-opacity-70"
            >
              <FaChevronLeft className="text-3xl" />
            </button>

            <button
              onClick={nextImage}
              className="absolute right-6 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10 bg-black bg-opacity-50 rounded-full p-3 hover:bg-opacity-70"
            >
              <FaChevronRight className="text-3xl" />
            </button>

            {/* Image Container */}
            <div className="relative max-w-5xl max-h-full flex flex-col items-center">
              {/* Close Button - Inside Image Container */}
              <button
                onClick={closeLightbox}
                className="absolute top-2 right-2 text-white hover:text-red-400 transition-colors z-20 bg-red-600 hover:bg-red-700 rounded-full p-2 shadow-lg"
                title="Đóng ảnh"
              >
                <FaTimes className="text-lg" />
              </button>
              
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="max-w-full max-h-[70vh] object-contain rounded-lg"
                onError={(e) => {
                  e.target.src = `https://images.unsplash.com/photo-1594736797933-d0300ba38463?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80`;
                }}
              />
            </div>

            {/* Counter */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white text-sm">
              {currentIndex + 1} / {filteredImages.length}
            </div>
          </div>
        )}

        {/* Background Decorative Elements */}
        <div className="absolute top-24 left-12 w-2 h-2 bg-green-500 rounded-full animate-ping opacity-30"></div>
        <div className="absolute top-48 right-16 w-3 h-3 bg-blue-500 rounded-full animate-ping delay-500 opacity-30"></div>
        <div className="absolute bottom-36 left-1/3 w-1 h-1 bg-purple-500 rounded-full animate-ping delay-1000 opacity-30"></div>
      </div>
    </div>
  );
};

export default PhotoGallery;
