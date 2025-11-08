import React, { useState } from 'react';
import './StatBox.css';

function StatBox({ label, value, tooltip, shape = 'square', color = 'primary' }) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className={`stat-box stat-box-${shape} stat-box-${color}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      {tooltip && showTooltip && (
        <div className="stat-tooltip">{tooltip}</div>
      )}
    </div>
  );
}

export default StatBox;
