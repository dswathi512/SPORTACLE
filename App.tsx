
import React, { useState, useMemo } from 'react';
import { User, UserRole, AthleteProfile, OfficialProfile, TestResult } from './types';
import RoleSelection from './components/RoleSelection';
import AthleteSignUp from './components/AthleteSignUp';
import OfficialSignUp from './components/OfficialSignUp';
import AthleteDashboard from './components/AthleteDashboard';
import ManagementDashboard from './components/ManagementDashboard';
import Header from './components/Header';
import { MOCK_ATHLETES } from './constants';

type View = 'selection' | 'athlete_signup' | 'official_signup' | 'dashboard';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<AthleteProfile | OfficialProfile | null>(null);
  const [view, setView] = useState<View>('selection');

  const handleAthleteSignUp = (user: User) => {
    // Create a full athlete profile
    const newAthleteProfile: AthleteProfile = {
        ...user,
        results: MOCK_ATHLETES[0]?.results.map(r => ({...r})) || [], // Use deep copy of mock results
    };

    // Ensure there's a default (empty) record for Height & Weight
    if (!newAthleteProfile.results.find(r => r.testId === 't1')) {
        newAthleteProfile.results.unshift({
            testId: 't1',
            latestScore: 0, // 0 indicates not set
            benchmark: 0,
            percentile: 0,
            history: []
        });
    }

    setCurrentUser(newAthleteProfile);
    setView('dashboard');
  };
  
  const handleOfficialSignUp = (user: User) => {
      const newOfficialProfile: OfficialProfile = {
          ...user
      };
      setCurrentUser(newOfficialProfile);
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
      case 'athlete_signup':
        return <AthleteSignUp onSignUp={handleAthleteSignUp} onBack={() => setView('selection')} />;
      case 'official_signup':
        return <OfficialSignUp onSignUp={handleOfficialSignUp} onBack={() => setView('selection')} />;
      case 'selection':
      default:
        return <RoleSelection onSelect={(role) => setView(role === 'athlete' ? 'athlete_signup' : 'official_signup')} />;
    }
  };

  return (
    <div className="bg-brand-light min-h-screen font-sans">
      {renderContent()}
    </div>
  );
};

export default App;
