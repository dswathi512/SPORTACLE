import React from 'react';
import { FaRunning, FaUserTie, FaTrophy } from 'react-icons/fa';
import { useLanguage } from '../App';

interface RoleSelectionProps {
  onSelect: (role: 'athlete' | 'official') => void;
  onNavigateToLogin: () => void;
}

const RoleSelection: React.FC<RoleSelectionProps> = ({ onSelect, onNavigateToLogin }) => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-brand-light flex flex-col justify-center items-center p-4">
      <div className="text-center mb-10">
        <FaTrophy className="w-20 h-20 text-brand-primary mx-auto" />
        <h1 className="mt-4 text-4xl font-extrabold text-brand-dark">{t('welcome_title')}</h1>
        <p className="mt-2 text-lg text-brand-gray">{t('welcome_subtitle')}</p>
      </div>
      <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-8">
        <button
          onClick={() => onSelect('athlete')}
          className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-center"
        >
          <FaRunning className="w-16 h-16 text-brand-secondary mx-auto mb-4 transition-transform duration-300 group-hover:scale-110" />
          <h2 className="text-2xl font-bold text-brand-dark">{t('role_athlete_title')}</h2>
          <p className="mt-2 text-brand-gray">{t('role_athlete_desc')}</p>
        </button>
        <button
          onClick={() => onSelect('official')}
          className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-center"
        >
          <FaUserTie className="w-16 h-16 text-brand-primary mx-auto mb-4 transition-transform duration-300 group-hover:scale-110" />
          <h2 className="text-2xl font-bold text-brand-dark">{t('role_official_title')}</h2>
          <p className="mt-2 text-brand-gray">{t('role_official_desc')}</p>
        </button>
      </div>
      <div className="mt-8 text-center">
        <p className="text-sm text-brand-gray">
          {t('login_link_prompt')}{' '}
          <button onClick={onNavigateToLogin} className="font-medium text-brand-primary hover:underline">
            {t('login_link')}
          </button>
        </p>
      </div>
    </div>
  );
};

export default RoleSelection;