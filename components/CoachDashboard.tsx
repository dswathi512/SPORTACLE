
import React, { useState, useEffect, useCallback } from 'react';
import { MOCK_ATHLETES } from '../constants';
import { AthleteProfile, FitnessTest, TestName } from '../types';
import { FITNESS_TESTS } from '../constants';
import { ProgressLineChart } from './ProgressChart';
import { generatePersonalizedFeedback } from '../services/geminiService';
import UserGroupIcon from './icons/UserGroupIcon';

const CoachDashboard: React.FC = () => {
  const [athletes] = useState<AthleteProfile[]>(MOCK_ATHLETES);
  const [selectedAthlete, setSelectedAthlete] = useState<AthleteProfile | null>(null);
  const [aiFeedback, setAiFeedback] = useState<string>('');
  const [isLoadingFeedback, setIsLoadingFeedback] = useState<boolean>(false);

  const handleGetFeedback = useCallback(async () => {
    if (selectedAthlete) {
      setIsLoadingFeedback(true);
      setAiFeedback('');
      const feedback = await generatePersonalizedFeedback(selectedAthlete);
      setAiFeedback(feedback);
      setIsLoadingFeedback(false);
    }
  }, [selectedAthlete]);

  useEffect(() => {
    if (athletes.length > 0) {
      setSelectedAthlete(athletes[0]);
    }
  }, [athletes]);

  const getTestInfo = (testId: string): FitnessTest | undefined => {
      return FITNESS_TESTS.find(t => t.id === testId);
  }

  return (
    <main className="container mx-auto p-4 md:p-6">
      <div className="flex items-center space-x-3 mb-6">
        <UserGroupIcon className="w-10 h-10 text-brand-primary" />
        <div>
          <h2 className="text-3xl font-extrabold text-brand-dark">Coach Dashboard</h2>
          <p className="text-brand-gray">Monitor and guide your team's performance.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Athlete List */}
        <div className="lg:col-span-1 bg-white p-4 rounded-2xl shadow-md">
          <h3 className="font-bold text-xl text-brand-dark mb-4 px-2">Your Athletes</h3>
          <ul className="space-y-2 max-h-[70vh] overflow-y-auto">
            {athletes.map(athlete => (
              <li key={athlete.id}>
                <button
                  onClick={() => setSelectedAthlete(athlete)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${selectedAthlete?.id === athlete.id ? 'bg-brand-primary text-white shadow-lg' : 'hover:bg-brand-light'}`}
                >
                  <p className="font-semibold">{athlete.firstName} {athlete.lastName}</p>
                  <p className={`text-sm ${selectedAthlete?.id === athlete.id ? 'text-gray-200' : 'text-brand-gray'}`}>{athlete.sport}</p>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Selected Athlete Details */}
        <div className="lg:col-span-2 space-y-6">
          {selectedAthlete ? (
            <>
              <div className="bg-white p-6 rounded-2xl shadow-md">
                <h3 className="font-bold text-2xl text-brand-dark">{selectedAthlete.firstName} {selectedAthlete.lastName}'s Performance</h3>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {selectedAthlete.results.map(result => {
                        const testInfo = getTestInfo(result.testId);
                        if (!testInfo) return null;
                        return (
                            <div key={result.testId} className="bg-brand-light p-4 rounded-lg">
                                <h4 className="font-bold text-brand-dark">{testInfo.name}</h4>
                                <ProgressLineChart data={result.history} unit={testInfo.unit} />
                            </div>
                        )
                    })}
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-md">
                <h3 className="font-bold text-xl text-brand-dark mb-4">AI-Powered Feedback</h3>
                <button onClick={handleGetFeedback} disabled={isLoadingFeedback} className="bg-brand-secondary text-brand-dark font-bold py-2 px-6 rounded-lg hover:bg-opacity-90 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed">
                  {isLoadingFeedback ? 'Generating...' : 'Get AI Suggestions'}
                </button>
                {aiFeedback && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg whitespace-pre-wrap font-sans text-brand-dark">
                    {aiFeedback}
                  </div>
                )}
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

export default CoachDashboard;
