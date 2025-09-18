
import React from 'react';

const TrophyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path
      d="M12.75 21a.75.75 0 0 1-.75-.75v-3.375c0-.414.336-.75.75-.75h.008c.414 0 .75.336.75.75v3.375a.75.75 0 0 1-.75.75h-.008ZM12 2.25a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75V3a.75.75 0 0 1 .75-.75Z"
    />
    <path
      fillRule="evenodd"
      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
      clipRule="evenodd"
    />
  </svg>
);

export default TrophyIcon;
