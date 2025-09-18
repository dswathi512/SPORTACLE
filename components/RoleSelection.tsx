
import React from 'react';
import TrophyIcon from './icons/TrophyIcon';
import UserGroupIcon from './icons/UserGroupIcon';

const RoleSelection: React.FC<{ onSelect: (role: 'athlete' | 'official') => void }> = ({ onSelect }) => {
  return (
    <div className="min-h-screen bg-brand-light flex flex-col justify-center items-center p-4">
      <div className="text-center mb-10">
        <TrophyIcon className="w-20 h-20 text-brand-primary mx-auto" />
        <h1 className="mt-4 text-4xl font-extrabold text-brand-dark">Welcome to SPORTACLE</h1>
        <p className="mt-2 text-lg text-brand-gray">Select your role to get started.</p>
      </div>
      <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-8">
        <button
          onClick={() => onSelect('athlete')}
          className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-center"
        >
          <TrophyIcon className="w-16 h-16 text-brand-secondary mx-auto mb-4 transition-transform duration-300 group-hover:scale-110" />
          <h2 className="text-2xl font-bold text-brand-dark">I am an Athlete</h2>
          <p className="mt-2 text-brand-gray">Sign up to record your performance, track progress, and get discovered.</p>
        </button>
        <button
          onClick={() => onSelect('official')}
          className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-center"
        >
          <UserGroupIcon className="w-16 h-16 text-brand-primary mx-auto mb-4 transition-transform duration-300 group-hover:scale-110" />
          <h2 className="text-2xl font-bold text-brand-dark">I am an Official / Coach</h2>
          <p className="mt-2 text-brand-gray">Register to monitor athletes, analyze data, and identify new talent.</p>
        </button>
      </div>
    </div>
  );
};

export default RoleSelection;
