import React from 'react';
import { InformationCircleIcon } from '@heroicons/react/24/solid';

interface WarningSectionProps {
  content: string;
}

const WarningSection: React.FC<WarningSectionProps> = ({ content }) => {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-start gap-3">
      <InformationCircleIcon className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
      <p className="text-sm text-yellow-800">{content}</p>
    </div>
  );
};

export default WarningSection;
