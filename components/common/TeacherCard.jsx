import React from "react";
import Image from "next/image";
import { FaLinkedin, FaTwitter, FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";

const TeacherCard = ({ teacher }) => {
  const {
    name,
    role,
    imageUrl,
    description,
    experience,
    specialties,
    achievements,
    socialLinks = {}
  } = teacher;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Teacher Image */}
      <div className="relative h-64 w-full">
        <Image
          src={imageUrl || "/images/default-teacher.jpg"}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {/* Teacher Info */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-1">{name}</h3>
        <p className="text-pink-600 font-semibold mb-1">{role}</p>
        
        {experience && (
          <p className="text-sm text-gray-600 mb-1">
            <span className="font-medium">Kinh nghiệm:</span> {experience}
          </p>
        )}

        {achievements && achievements.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-800 mb-2">Kinh nghiệm:</p>
            <ul className="text-gray-700 text-sm space-y-1">
              {achievements.map((achievement, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-pink-600 mr-2 mt-0.5">•</span>
                  <span>{achievement.replace('•', '').trim()}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Specialties */}
        {specialties && specialties.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-800 mb-2">Chuyên môn:</p>
            <div className="flex flex-wrap gap-1">
              {specialties.map((specialty, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-pink-100 text-pink-800 text-xs rounded-full"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </div>
        )}


        {/* Social Links */}
        <div className="flex justify-center space-x-4 pt-4 border-t border-gray-100">
          {socialLinks.linkedin && (
            <a
              href={socialLinks.linkedin}
              className="text-[#0A66C2] hover:text-[#084d93] transition-colors"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`LinkedIn của ${name}`}
            >
              <FaLinkedin size={20} />
            </a>
          )}
          {socialLinks.facebook && (
            <a
              href={socialLinks.facebook}
              className="text-[#1877F2] hover:text-[#0f5dc8] transition-colors"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Facebook của ${name}`}
            >
              <FaFacebook size={20} />
            </a>
          )}
          {socialLinks.instagram && (
            <a
              href={socialLinks.instagram}
              className="text-[#E4405F] hover:text-[#d03452] transition-colors"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Instagram của ${name}`}
            >
              <FaInstagram size={20} />
            </a>
          )}
          {socialLinks.youtube && (
            <a
              href={socialLinks.youtube}
              className="text-[#FF0000] hover:text-[#cc0000] transition-colors"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`YouTube của ${name}`}
            >
              <FaYoutube size={20} />
            </a>
          )}
          {socialLinks.tiktok && (
            <a
              href={socialLinks.tiktok}
              className="text-black hover:text-[#25F4EE] transition-colors"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`TikTok của ${name}`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherCard;

