
import React from 'react';

const VideoCameraIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M4.5 4.5a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h8.25a3 3 0 0 0 3-3v-9a3 3 0 0 0-3-3H4.5ZM19.5 6.75a.75.75 0 0 0-1.125-.632l-3.375 2.025V15.86l3.375 2.025a.75.75 0 0 0 1.125-.632V6.75Z" />
  </svg>
);

export default VideoCameraIcon;
