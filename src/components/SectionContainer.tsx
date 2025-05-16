import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface SectionContainerProps {
  title: string;
  children: ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  nextSection: string;
  nextSectionLabel?: string;
  previousSection?: string;
}

const SectionContainer: React.FC<SectionContainerProps> = ({
  title,
  children,
  onSubmit,
  nextSection,
  nextSectionLabel = 'Next',
  previousSection
}) => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(e);
    if (nextSection) navigate(nextSection);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 my-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">{title}</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {children}
        
        <div className="flex justify-between mt-8 pt-4 border-t">
          {previousSection && (
            <button
              type="button"
              onClick={() => navigate(previousSection)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              Back
            </button>
          )}
          
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors ml-auto"
          >
            Next: {nextSectionLabel}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SectionContainer;