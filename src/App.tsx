import React, { useState, useMemo, createContext, useContext, useEffect } from 'react';
import { User, UserRole, AthleteProfile, OfficialProfile, Language, HeightWeightData } from './types';
import RoleSelection from './components/RoleSelection';
import AthleteSignUp from './components/AthleteSignUp';
import OfficialSignUp from './components/OfficialSignUp';
import AthleteDashboard from './components/AthleteDashboard';
import ManagementDashboard from './components/ManagementDashboard';
import Header from './components/Header';
import { MOCK_ATHLETES, MOCK_COACH_USER, MOCK_OFFICIAL_USER, TRANSLATIONS } from './constants';
import HeightWeightEntry from './components/HeightWeightEntry';
import Login from './components/Login';

type View = 'selection' | 'login' | 'athlete_signup' | 'official_signup' | 'dashboard' | 'height_weight_entry';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, options?: { [key: string]: string | number }) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);
export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<AthleteProfile | OfficialProfile | null>(null);
  const [view, setView] = useState<View>('selection');
  const [language, setLanguage] = useState<Language>(() => (localStorage.getItem('sportacle_lang') as Language) || 'en');

  useEffect(() => {
    localStorage.setItem('sportacle_lang', language);
  }, [language]);

  const t = (key: string, options?: { [key: string]: string | number }): string => {
    let text = TRANSLATIONS[language][key] || TRANSLATIONS['en'][key] || key;
    if (options) {
      Object.keys(options).forEach(placeholder => {
        text = text.replace(`{${placeholder}}`, String(options[placeholder]));
      });
    }
    return text;
  };
  
  const allMockUsers = useMemo(() => [
    ...MOCK_ATHLETES,
    MOCK_COACH_USER,
    MOCK_OFFICIAL_USER
  ], []);

  const handleLogin = (contact: string): boolean => {
    const user = allMockUsers.find(u => u.contact.toLowerCase() === contact.toLowerCase());
    if (user) {
        setCurrentUser(user as AthleteProfile | OfficialProfile);
        setLanguage(user.language);
        // In a real app, you'd check if H&W is complete. For this mock, go straight to dashboard.
        if (user.role === UserRole.ATHLETE && !(user as AthleteProfile).heightWeight) {
             setView('height_weight_entry');
        } else {
             setView('dashboard');
        }
        return true;
    }
    return false;
  };

  const handleAthleteSignUp = (user: User) => {
    const newAthleteProfile: AthleteProfile = {
        ...user,
        results: [], // Start with empty results
    };
    setCurrentUser(newAthleteProfile);
    setLanguage(user.language);
    setView('height_weight_entry'); // Go to mandatory H&W entry first
  };

  const handleHeightWeightSubmit = (data: HeightWeightData) => {
    if (currentUser && currentUser.role === UserRole.ATHLETE) {
        const updatedProfile: AthleteProfile = {
            ...(currentUser as AthleteProfile),
            heightWeight: data,
            results: MOCK_ATHLETES[0]?.results.map(r => ({...r})) || [], // Add mock results after H&W
        };
        setCurrentUser(updatedProfile);
        setView('dashboard');
    }
  };
  
  const handleOfficialSignUp = (user: User) => {
      const newOfficialProfile: OfficialProfile = {
          ...user
      };
      setCurrentUser(newOfficialProfile);
      setLanguage(user.language);
      setView('dashboard');
  }

  const handleLogout = () => {
    setCurrentUser(null);
    setView('selection');
  };

  const renderContent = () => {
    if (view === 'dashboard' && currentUser) {
      return (
        <>
          <Header user={currentUser} onLogout={handleLogout} />
          {currentUser.role === UserRole.ATHLETE ? (
            <AthleteDashboard athlete={currentUser as AthleteProfile} />
          ) : (
            <ManagementDashboard user={currentUser as OfficialProfile} />
          )}
        </>
      );
    }

    switch (view) {
      case 'login':
        return <Login onLogin={handleLogin} onNavigateToSignUp={() => setView('selection')} />;
      case 'height_weight_entry':
        return <HeightWeightEntry onSubmit={handleHeightWeightSubmit} />;
      case 'athlete_signup':
        return <AthleteSignUp onSignUp={handleAthleteSignUp} onBack={() => setView('selection')} />;
      case 'official_signup':
        return <OfficialSignUp onSignUp={handleOfficialSignUp} onBack={() => setView('selection')} />;
      case 'selection':
      default:
        return <RoleSelection 
                    onSelect={(role) => setView(role === 'athlete' ? 'athlete_signup' : 'official_signup')} 
                    onNavigateToLogin={() => setView('login')}
                />;
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      <div className="bg-brand-light min-h-screen font-sans">
        {renderContent()}
      </div>
    </LanguageContext.Provider>
  );
};

export default App;