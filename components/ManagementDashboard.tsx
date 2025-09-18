
import React, { useState, useMemo } from 'react';
import { MOCK_ATHLETES } from '../constants';
import { AthleteProfile, FitnessTest, OfficialProfile, OfficialRole, Sport } from '../types';
import { FITNESS_TESTS } from '../constants';
import { ProgressLineChart, DistributionBarChart } from './ProgressChart';
import ChartBarIcon from './icons/ChartBarIcon';

const ManagementDashboard: React.FC<{ user: OfficialProfile }> = ({ user }) => {
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
        <ChartBarIcon className="w-10 h-10 text-brand-primary" />
        <div>
          <h2 className="text-3xl font-extrabold text-brand-dark">Management Dashboard</h2>
          <p className="text-brand-gray">Monitor, analyze, and guide athletic talent.</p>
        </div>
      </div>
      
      {user.officialRole !== OfficialRole.COACH && (
        <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="font-bold text-xl text-brand-dark mb-4">Nationwide Athlete Distribution</h3>
            <DistributionBarChart data={athletesBySport} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Athlete List */}
        <div className="lg:col-span-1 bg-white p-4 rounded-2xl shadow-md">
          <h3 className="font-bold text-xl text-brand-dark mb-4 px-2">Athlete Roster</h3>
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
                    <h3 className="font-bold text-xl text-brand-dark mb-4">Submission Status</h3>
                    <div className="flex items-center justify-between">
                        <p className="text-brand-gray">
                            <span className="font-semibold text-green-600">Verified</span> - Last updated on {new Date().toLocaleDateString()}
                        </p>
                        <div className="flex space-x-2">
                            <button onClick={() => alert(`Submission for ${selectedAthlete.firstName} has been flagged for review.`)} className="py-2 px-4 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition-colors text-sm">Flag for Review</button>
                            <button onClick={() => alert(`${selectedAthlete.firstName}'s latest results approved.`)} className="py-2 px-4 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors text-sm">Approve</button>
                        </div>
                    </div>
                 </div>
              )}

              <div className="bg-white p-6 rounded-2xl shadow-md">
                <h3 className="font-bold text-2xl text-brand-dark">{selectedAthlete.firstName} {selectedAthlete.lastName}'s Performance</h3>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {selectedAthlete.results.map(result => {
                        const testInfo = getTestInfo(result.testId);
                        if (!testInfo || testInfo.name === 'Height & Weight') return null;
                        return (
                            <div key={result.testId} className="bg-brand-light p-4 rounded-lg">
                                <h4 className="font-bold text-brand-dark">{testInfo.name}</h4>
                                <ProgressLineChart data={result.history} unit={testInfo.unit} />
                            </div>
                        )
                    })}
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full bg-white p-6 rounded-2xl shadow-md">
              <p className="text-brand-gray">Select an athlete to view their details.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default ManagementDashboard;
