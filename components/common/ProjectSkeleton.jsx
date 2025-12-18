// components/common/ProjectSkeleton.jsx
import React from 'react';

const ProjectSkeleton = () => {
  return (
    <div className="skeleton-card bg-white/80 backdrop-blur-lg rounded-3xl overflow-hidden relative shadow-xl border border-gray-200/50">
      {/* Image skeleton */}
      <div className="skeleton-image rounded-t-3xl"></div>
      
      {/* Content skeleton */}
      <div className="p-8">
        {/* Title skeleton */}
        <div className="skeleton-title mb-6"></div>
        
        {/* Details grid skeleton */}
        <div className="grid grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 rounded-xl bg-gray-100/50">
              {/* Icon skeleton */}
              <div className="w-10 h-10 rounded-xl bg-gray-200 skeleton"></div>
              
              {/* Text skeleton */}
              <div className="flex-1 space-y-2">
                <div className="skeleton-text w-16"></div>
                <div className="skeleton-text w-20"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ProjectGridSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>
          <ProjectSkeleton />
        </div>
      ))}
    </div>
  );
};

export default ProjectSkeleton;
export { ProjectGridSkeleton };
