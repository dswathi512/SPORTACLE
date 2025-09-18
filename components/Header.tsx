
import React from 'react';
import { User } from '../types';
import TrophyIcon from './icons/TrophyIcon';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="bg-brand-dark text-white p-4 shadow-lg sticky top-0 z-40">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <TrophyIcon className="w-8 h-8 text-brand-secondary" />
          <h1 className="text-xl font-bold">SPORTACLE</h1>
        </div>
        {user && (
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="font-semibold">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-gray-300">{user.role}</p>
            </div>
            <button onClick={onLogout} className="bg-brand-secondary text-brand-dark font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-all">
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
