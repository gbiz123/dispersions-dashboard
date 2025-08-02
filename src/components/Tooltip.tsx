import React, { useState } from 'react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block w-full">
      <div className="flex items-center gap-2">
        {children}
        <div
          className="relative"
          onMouseEnter={() => setIsVisible(true)}
          onMouseLeave={() => setIsVisible(false)}
        >
          <InformationCircleIcon className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-help" />
          {isVisible && (
            <div className="absolute z-10 w-64 p-2 text-sm bg-gray-800 text-white rounded shadow-lg -translate-x-1/2 left-1/2 bottom-full mb-2">
              {content}
              <div className="absolute w-2 h-2 bg-gray-800 transform rotate-45 -translate-x-1/2 left-1/2 -bottom-1"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tooltip;