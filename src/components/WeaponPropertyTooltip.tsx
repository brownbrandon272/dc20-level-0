import React, { useState } from 'react';
import weaponPropertiesData from '../data/weapon-properties.json';
import type { WeaponPropertyMap } from '../types';

const weaponProperties = weaponPropertiesData as WeaponPropertyMap;

interface WeaponPropertyTooltipProps {
  propertyName: string;
  children?: React.ReactNode;
}

/**
 * WeaponPropertyTooltip - Displays a tooltip with weapon property details on hover
 *
 * Usage:
 * <WeaponPropertyTooltip propertyName="Guard">Guard</WeaponPropertyTooltip>
 * <WeaponPropertyTooltip propertyName="Versatile" />
 */
function WeaponPropertyTooltip({ propertyName, children }: WeaponPropertyTooltipProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Handle special property names with ranges (e.g., "Toss (5/10)")
  const basePropertyName = propertyName.replace(/\s*\(.*?\)\s*$/, '').trim();

  const property = weaponProperties[basePropertyName];

  if (!property) {
    // If property not found, render without tooltip
    return <span className="font-body text-brown-medium">{children || propertyName}</span>;
  }

  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="font-body text-brown-text cursor-help border-b border-dotted border-brown-medium">
        {children || propertyName}
      </span>

      {isHovered && (
        <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 pointer-events-none">
          <div className="bg-parchment-dark border-2 border-brown-accent rounded-lg p-3 shadow-elevated">
            <div className="font-title text-sm font-bold text-brown-accent mb-1">
              {property.name}
            </div>
            <div className="font-body text-xs text-brown-text leading-relaxed">
              {property.fullDesc}
            </div>
            {/* Arrow pointing down */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-px">
              <div className="border-8 border-transparent border-t-brown-accent"></div>
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full">
                <div className="border-6 border-transparent border-t-parchment-dark"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </span>
  );
}

export default WeaponPropertyTooltip;
