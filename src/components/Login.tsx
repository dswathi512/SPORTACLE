import React, { useState, FC } from 'react';
import { useLanguage } from '../App';
import { FaTrophy } from 'react-icons/fa';

interface LoginProps {
  onLogin: (contact: string) => boolean;
  onNavigateToSignUp: () => void;
}

const Login: FC<LoginProps> = ({ onLogin, onNavigateToSignUp }) => {
  const { t } = useLanguage();
  const [contact, setContact] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = onLogin(contact);
    if (!success) {
      setError(t('login_error'));
    }
  };

  return (
    <div className="min-h-screen bg-brand-light flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <FaTrophy className="w-16 h-16 text-brand-primary mx-auto" />
          <h2 className="mt-4 text-3xl font-extrabold text-brand-dark">{t('login_title')}</h2>
          <p className="mt-2 text-brand-gray">{t('login_subtitle')}</p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="contact" className="block text-sm font-medium text-brand-gray">{t('label_contact_login')}</label>
              <input
                type="text"
                id="contact"
                name="contact"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                required
                placeholder="Email or Phone"
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
              />
            </div>
            {error && <p className="text-sm text-red-600 text-center">{error}</p>}
            <div>
              <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary">
                {t('button_login')}
              </button>
            </div>
          </form>
        </div>
        <div className="mt-6 text-center">
          <p className="text-sm text-brand-gray">
            {t('no_account_prompt')}{' '}
            <button onClick={onNavigateToSignUp} className="font-medium text-brand-primary hover:underline">
              {t('signup_link')}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;