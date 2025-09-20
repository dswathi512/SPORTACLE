import React, { useState, useMemo } from 'react';
import { MOCK_ATHLETES } from '../constants';
import { AthleteProfile, FitnessTest, OfficialProfile, OfficialRole, Sport } from '../types';
import { FITNESS_TESTS } from '../constants';
import { ProgressLineChart, DistributionBarChart } from './ProgressChart';
import { FaChartBar } from 'react-icons/fa';
import { useLanguage } from '../App';

const ManagementDashboard: React.FC<{ user: OfficialProfile }> = ({ user }) => {
  const { t } = useLanguage();
  const [athletes] = useState<AthleteProfile[]>(MOCK_ATHLETES);
  const [selectedAthlete, setSelectedAthlete] = useState<AthleteProfile | null>(athletes[0] || null);

  const getTestInfo = (testId: string): FitnessTest | undefined => {
      return FITNESS_TESTS.find(t => t.id === testId);
  }

  const athletesBySport = useMemo(() => Object.values(Sport).map(sport => ({
    name: sport,
    value: athletes.filter(a => a.sport === sport).length,
  })).filter(s => s.value > 0), [athletes]);

  return (
    <main className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <FaChartBar className="w-10 h-10 text-brand-primary" />
        <div>
          <h2 className="text-3xl font-extrabold text-brand-dark">{t('management_dashboard_title')}</h2>
          <p className="text-brand-gray">{t('management_dashboard_subtitle')}</p>
        </div>
      </div>
      
      {user.officialRole !== OfficialRole.COACH && (
        <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="font-bold text-xl text-brand-dark mb-4">{t('nationwide_distribution_title')}</h3>
            <DistributionBarChart data={athletesBySport} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Athlete List */}
        <div className="lg:col-span-1 bg-white p-4 rounded-2xl shadow-md">
          <h3 className="font-bold text-xl text-brand-dark mb-4 px-2">{t('athlete_roster_title')}</h3>
          <ul className="space-y-2 max-h-[70vh] overflow-y-auto">
            {athletes.map(athlete => (
              <li key={athlete.id}>
                <button
                  onClick={() => setSelectedAthlete(athlete)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${selectedAthlete?.id === athlete.id ? 'bg-brand-primary text-white shadow-lg' : 'hover:bg-brand-light'}`}
                >
                  <p className="font-semibold">{athlete.firstName} {athlete.lastName}</p>
                  <p className={`text-sm ${selectedAthlete?.id === athlete.id ? 'text-gray-200' : 'text-brand-gray'}`}>{athlete.sport} - {athlete.roleInSport}</p>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Selected Athlete Details */}
        <div className="lg:col-span-2 space-y-6">
          {selectedAthlete ? (
            <>
              {/* Approval Section for Officials */}
              {user.officialRole !== OfficialRole.COACH && (
                 <div className="bg-white p-6 rounded-2xl shadow-md">
                    <h3 className="font-bold text-xl text-brand-dark mb-4">{t('submission_status_title')}</h3>
                    <div className="flex items-center justify-between">
                        <p className="text-brand-gray">
                            <span className="font-semibold text-green-600">{t('status_verified')}</span> - {t('status_last_updated', { date: new Date().toLocaleDateString() })}
                        </p>
                        <div className="flex space-x-2">
                            <button onClick={() => alert(t('alert_flagged_for_review', { name: selectedAthlete.firstName }))} className="py-2 px-4 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition-colors text-sm">{t('button_flag_review')}</button>
                            <button onClick={() => alert(t('alert_results_approved', { name: selectedAthlete.firstName }))} className="py-2 px-4 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors text-sm">{t('button_approve')}</button>
                        </div>
                    </div>
                 </div>
              )}

              <div className="bg-white p-6 rounded-2xl shadow-md">
                <h3 className="font-bold text-2xl text-brand-dark">{t('athlete_performance_title', { name: `${selectedAthlete.firstName} ${selectedAthlete.lastName}` })}</h3>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {selectedAthlete.results.map(result => {
                        const testInfo = getTestInfo(result.testId);
                        if (!testInfo) return null;
                        return (
                            <div key={result.testId} className="bg-brand-light p-4 rounded-lg">
                                <h4 className="font-bold text-brand-dark">{t(`test_name_${testInfo.name}`)}</h4>
                                <ProgressLineChart data={result.history} unit={testInfo.unit} />
                            </div>
                        )
                    })}
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full bg-white p-6 rounded-2xl shadow-md">
              <p className="text-brand-gray">{t('select_athlete_prompt')}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default ManagementDashboard;