import React from 'react';

const UserGroupIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path
      d="M4.5 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM14.25 8.625a3.375 3.375 0 1 1 6.75 0 3.375 3.375 0 0 1-6.75 0ZM1.5 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63A13.067 13.067 0 0 1 8.25 22.5c-2.41 0-4.72-.668-6.657-1.879a.75.75 0 0 1-.364-.63l-.001-.12v-.003ZM12.375 19.125a5.625 5.625 0 0 1 11.25 0v.003l-.001.119a.75.75 0 0 1-.363.63A13.067 13.067 0 0 1 16.5 22.5c-1.815 0-3.546-.503-5.04-1.406a.75.75 0 0 1-.364-.63l-.001-.12v-.003Z"
    />
  </svg>
);

export default UserGroupIcon;