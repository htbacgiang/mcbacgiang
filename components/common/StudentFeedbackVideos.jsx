"use client";
import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { toCloudinaryUrl } from '../../utils/cloudinary';

const StudentFeedbackVideos = ({ 
  title = "Feedback từ học viên", 
  subtitle = "Những chia sẻ chân thật từ các học viên đã hoàn thành khóa học tại BT Academy",
  videos = [] 
}) => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Default sample videos if none provided
  const defaultVideos = [
    {
      id: 1,
      title: "Khóa học MC đã thay đổi cuộc đời tôi",
      description: "Từ một người nhút nhát không dám nói trước đám đông, tôi đã tự tin trở thành MC chuyên nghiệp. BT Academy không chỉ dạy kỹ thuật mà còn giúp tôi xây dựng bản lĩnh và phong cách riêng.",
      youtubeId: "dQw4w9WgXcQ",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
      studentInfo: {
        name: "Minh Trang",
        job: "MC Freelancer",
        company: "Tự do",
        avatar: "/images/students/student1.jpg"
      },
      rating: 5,
      course: "MC Cơ bản"
    },
    {
      id: 2,
      title: "Từ sinh viên đến MC chuyên nghiệp",
      description: "BT Academy đã giúp tôi nâng cao kỹ năng và có được công việc mơ ước tại công ty sự kiện hàng đầu. Giảng viên rất tận tâm và chương trình học thiết thực.",
      youtubeId: "z0EXWNIaAYg",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
      studentInfo: {
        name: "Hoàng Nam",
        job: "MC Sự kiện",
        company: "Event Pro",
        avatar: "/images/students/student2.jpg"
      },
      rating: 5,
      course: "MC Nâng cao"
    },
    {
      id: 3,
      title: "Giọng nói của tôi đã thay đổi hoàn toàn",
      description: "Sau khóa học phát thanh tại BT Academy, giọng nói của tôi trở nên chuyên nghiệp và thu hút. Tôi đã có thể làm việc tại đài phát thanh uy tín.",
      youtubeId: "dQw4w9WgXcQ",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
      studentInfo: {
        name: "Thu Hà",
        job: "Phát thanh viên",
        company: "VOV Radio",
        avatar: "/images/students/student3.jpg"
      },
      rating: 5,
      course: "Phát thanh"
    },
    {
      id: 4,
      title: "Ước mơ làm MC truyền hình đã thành hiện thực",
      description: "Nhờ kiến thức và kỹ năng học được tại BT Academy, tôi đã vượt qua vòng tuyển chọn khốc liệt và trở thành MC của đài truyền hình quốc gia.",
      youtubeId: "dQw4w9WgXcQ",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
      studentInfo: {
        name: "Đức Minh",
        job: "MC Truyền hình",
        company: "VTV",
        avatar: "/images/students/student4.jpg"
      },
      rating: 5,
      course: "MC Chuyên nghiệp"
    }
  ];

  const displayVideos = videos.length > 0 ? videos : defaultVideos;
  const totalSlides = Math.ceil(displayVideos.length / 2);

  const openVideoModal = (video) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const closeVideoModal = () => {
    setSelectedVideo(null);
    setIsModalOpen(false);
  };

  const getYouTubeEmbedUrl = (videoId) => {
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
  };

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Auto slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [nextSlide]);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <svg
        key={index}
        className={`w-4 h-4 ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <>
      <section className="py-16 bg-white"  >

        <div className="max-w-6xl mx-auto px-4 relative">
          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <div>
           
              <h2 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900">
                Học viên nói gì về chúng tôi
              </h2>
              <p className="text-gray-600 max-w-xl">
                Những chia sẻ thành công từ học viên BT Academy
              </p>
            </div>

            {/* Navigation Arrows */}
            <div className="flex space-x-2">
              <button
                onClick={prevSlide}
                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextSlide}
                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Slider Container */}
          <div className="relative overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                <div key={slideIndex} className="w-full flex-shrink-0">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {displayVideos.slice(slideIndex * 2, slideIndex * 2 + 2).map((video, index) => (
                      <div key={video.id} className="group">
                        {/* Video Section */}
                        <div className="relative mb-6">
                          <div 
                            className="aspect-video bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden cursor-pointer relative shadow-xl hover:shadow-2xl transition-all duration-500 transform group-hover:-translate-y-1"
                            onClick={() => openVideoModal(video)}
                          >
                            <Image
                              src={video.thumbnail}
                              alt={video.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            {/* Play Button Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 flex items-center justify-center group-hover:from-black/40 group-hover:to-black/10 transition-all duration-500">
                              <div className="w-18 h-18 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 group-hover:bg-white transition-all duration-300 shadow-2xl border-2 border-white/50">
                                <svg className="w-7 h-7 text-red-500 ml-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                </svg>
                              </div>
                            </div>
                            {/* Course Badge */}
                            <div className="absolute top-4 left-4">
                              <span className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold rounded-full shadow-lg backdrop-blur-sm border border-white/20">
                                {video.course}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Testimonial Text */}
                        <div className="relative bg-gradient-to-br from-white via-gray-50/30 to-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                          {/* Quote Icon */}
                          <div className="absolute -top-4 left-8">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-xl transform rotate-3">
                              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                              </svg>
                            </div>
                          </div>

                          {/* Quote Text */}
                          <div className="pt-3">
                            <p className="text-gray-700 leading-[1.7] mb-3 italic text-lg font-light"
                               style={{
                                 display: '-webkit-box',
                                 WebkitLineClamp: 4,
                                 WebkitBoxOrient: 'vertical',
                                 overflow: 'hidden'
                               }}>
                              &quot;{video.description}&quot;
                            </p>

                            {/* Divider */}
                            <div className="w-12 h-0.5 bg-gradient-to-r from-blue-500 to-transparent mb-5"></div>

                            {/* Author Info */}
                            <div className="flex items-center space-x-4">
                              <div className="relative">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                                  {video.studentInfo.name.charAt(0)}
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                              </div>
                              <div className="flex-1">
                                <h4 className="font-bold text-gray-900 text-lg mb-1">
                                  {video.studentInfo.name}
                                </h4>
                                <p className="text-blue-600 text-sm font-medium">
                                  {video.studentInfo.job}
                                </p>
                             
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center space-x-2 mt-8">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-blue-600 w-6' 
                    : 'bg-gray-400 hover:bg-gray-500'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {isModalOpen && selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-5xl w-full">
            {/* Close Button */}
            <button
              onClick={closeVideoModal}
              className="absolute -top-12 right-0 w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all duration-300 z-10"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* YouTube Video */}
            <div className="aspect-video rounded-xl overflow-hidden shadow-2xl">
              <iframe
                src={getYouTubeEmbedUrl(selectedVideo.youtubeId)}
                title={selectedVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StudentFeedbackVideos;

