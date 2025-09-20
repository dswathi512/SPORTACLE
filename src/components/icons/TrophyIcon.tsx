
import React from 'react';

const TrophyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M15.75 2.25a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-3.352l-2.034 3.05a2.5 2.5 0 01-4.432 0L6.75 4.148V7.5a.75.75 0 01-1.5 0v-4.5a.75.75 0 01.75-.75h10.5zM3.75 9a.75.75 0 000 1.5h16.5a.75.75 0 000-1.5H3.75zM3 12.75a.75.75 0 01.75-.75h16.5a.75.75 0 01.75.75v6a.75.75 0 01-.75.75H3.75a.75.75 0 01-.75-.75v-6zM10.5 14.25a.75.75 0 01.75.75v3a.75.75 0 01-1.5 0v-3a.75.75 0 01.75-.75z"
      clipRule="evenodd"
    />
  </svg>
);

export default TrophyIcon;