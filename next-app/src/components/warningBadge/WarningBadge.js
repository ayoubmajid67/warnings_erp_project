'use client';

import './WarningBadge.css';

/**
 * WarningBadge - Visual warning counter (0-3) with color states
 * @param {number} count - Warning count (0-3)
 * @param {boolean} showLabel - Show text label
 * @param {string} size - 'sm' | 'md' | 'lg'
 */
export default function WarningBadge({ count = 0, showLabel = false, size = 'md' }) {
  const getStatusClass = () => {
    if (count >= 3) return 'dropped';
    if (count === 2) return 'at-risk';
    if (count === 1) return 'warning';
    return 'clean';
  };

  const getStatusLabel = () => {
    if (count >= 3) return 'Dropped';
    if (count === 2) return 'At Risk';
    if (count === 1) return '1 Warning';
    return 'Active';
  };

  return (
    <div className={`warning-badge ${getStatusClass()} size-${size}`}>
      <div className="warning-dots">
        {[1, 2, 3].map((i) => (
          <span 
            key={i} 
            className={`warning-dot ${i <= count ? `active level-${i}` : ''}`}
          />
        ))}
      </div>
      {showLabel && (
        <span className="warning-label">{getStatusLabel()}</span>
      )}
      <span className="warning-count">{count}/3</span>
    </div>
  );
}

/**
 * WarningCounter - Simple dot-based counter
 */
export function WarningCounter({ count = 0 }) {
  return (
    <div className="warning-counter">
      {[1, 2, 3].map((i) => (
        <span 
          key={i} 
          className={`warning-dot ${i <= count ? `active warning-${i}` : ''}`}
        />
      ))}
    </div>
  );
}

/**
 * StatusBadge - Shows member status
 */
export function StatusBadge({ status }) {
  const isActive = status === 'active';
  
  return (
    <span className={`status-badge ${isActive ? 'active' : 'dropped'}`}>
      <span className="status-dot" />
      {isActive ? 'Active' : 'Dropped'}
    </span>
  );
}
