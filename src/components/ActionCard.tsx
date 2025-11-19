import React from 'react';

interface ActionCardProps {
  action: {
    id: string;
    name: string;
    cost: string;
    desc: string;
    descSummary?: string;
    descExtremeSummary?: string;
    variant?: {
      id: string;
      name: string;
      cost: string;
      desc: string;
    };
  };
  displayMode: 'full' | 'summary' | 'extreme';
  onClick?: () => void;
}

export default function ActionCard({ action, displayMode, onClick }: ActionCardProps) {
  const getDisplayContent = () => {
    switch (displayMode) {
      case 'extreme':
        return action.descExtremeSummary || action.name;
      case 'summary':
        return action.descSummary || action.desc;
      case 'full':
      default:
        return action.desc;
    }
  };

  return (
    <div
      className={`bg-parchment-light border border-brown-medium rounded-lg p-4 ${
        onClick ? 'cursor-pointer hover:border-brown-accent transition-all' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-title text-lg font-semibold text-brown-text">
          {action.name}
        </h3>
        <span className="bg-brown-accent text-parchment-light px-3 py-1 rounded-full text-sm font-sans font-semibold whitespace-nowrap">
          {action.cost}
        </span>
      </div>

      <div className="font-body text-sm text-brown-text">
        {displayMode === 'extreme' ? (
          <span className="italic text-brown-medium">{getDisplayContent()}</span>
        ) : displayMode === 'summary' ? (
          <p className="text-brown-text">{getDisplayContent()}</p>
        ) : (
          <div className="whitespace-pre-wrap">{getDisplayContent()}</div>
        )}
      </div>

      {/* Show variant if exists and display mode is full */}
      {action.variant && displayMode === 'full' && (
        <div className="mt-3 pt-3 border-t border-brown-medium">
          <div className="flex items-start justify-between mb-1">
            <h4 className="font-title text-base font-semibold text-brown-text">
              {action.variant.name}
            </h4>
            <span className="bg-gold text-parchment-light px-2 py-1 rounded-full text-xs font-sans font-semibold whitespace-nowrap">
              {action.variant.cost}
            </span>
          </div>
          <p className="font-body text-sm text-brown-text whitespace-pre-wrap">
            {action.variant.desc}
          </p>
        </div>
      )}
    </div>
  );
}
