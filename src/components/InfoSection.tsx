import React from 'react';
import { InformationCircleIcon } from '@heroicons/react/24/solid';

interface InfoSectionProps {
  content: string;
}

const InfoSection: React.FC<InfoSectionProps> = ({ content }) => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
      <InformationCircleIcon className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
      <p className="text-sm text-blue-800">{content}</p>
    </div>
  );
};

export default InfoSection;