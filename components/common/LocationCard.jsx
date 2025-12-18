import React from 'react';

const LocationCard = ({ location, index }) => {
  return (
    <div className="p-2 border-b border-gray-200 last:border-b-0">
      <div className="font-medium text-gray-900 text-sm">
        {location.name}
      </div>
      <div className="text-xs text-gray-600 mt-1">
        {location.address}
      </div>
    </div>
  );
};

export default LocationCard;
