import React from 'react';
import { CButton } from '@coreui/react-pro';
import noDataFound from '../assets/no-data-found.svg';

interface EmptyStateProps {
  title?: string;
  description?: string;
  imageSize?: number;
  className?: string;
  actionButton?: {
    text: string;
    onClick: () => void;
    color?: string;
    variant?: 'outline' | 'ghost';
  };
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No Data Found",
  description = "There is currently no data to display.",
  imageSize = 120,
  className = "",
  actionButton
}) => {
  return (
    <div className={`text-center py-5 ${className}`}>
      <img 
        src={noDataFound} 
        alt="No data found" 
        width={imageSize} 
        height={imageSize} 
        className="mb-3 opacity-75" 
      />
      <h5 className="text-muted">{title}</h5>
      <p className="text-muted small">{description}</p>
      {actionButton && (
        <CButton
          color={actionButton.color || 'primary'}
          variant={actionButton.variant || 'outline'}
          onClick={actionButton.onClick}
          className="mt-3"
        >
          {actionButton.text}
        </CButton>
      )}
    </div>
  );
};

export default EmptyState; 