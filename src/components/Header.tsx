import React from 'react';
import { User, Language } from '../types';
import { FaTrophy } from 'react-icons/fa';
import { useLanguage } from '../App';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  return (
    <div className="relative">
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        className="bg-brand-dark text-white rounded-md py-1 px-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-secondary"
        aria-label="Select language"
      >
        <option value="en">EN</option>
        <option value="hi">HI</option>
        <option value="ta">TA</option>
        <option value="te">TE</option>
      </select>
    </div>
  );
};

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  const { t } = useLanguage();
  return (
    <header className="bg-brand-dark text-white p-4 shadow-lg sticky top-0 z-40">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <FaTrophy className="w-8 h-8 text-brand-secondary" />
          <h1 className="text-xl font-bold">{t('header_title')}</h1>
        </div>
        {user && (
          <div className="flex items-center space-x-4">
            <LanguageSelector />
            <div className="text-right hidden sm:block">
              <p className="font-semibold">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-gray-300">{user.role}</p>
            </div>
            <button onClick={onLogout} className="bg-brand-secondary text-brand-dark font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-all">
              {t('button_logout')}
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;