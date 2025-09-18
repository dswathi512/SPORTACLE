
import React, { useState, useCallback } from 'react';
import { AthleteProfile } from '../types';
import { FITNESS_TESTS } from '../constants';
import FitnessTestCard from './FitnessTestCard';
import TrophyIcon from './icons/TrophyIcon';
import { generatePersonalizedFeedback } from '../services/geminiService';

const Leaderboard: React.FC = () => {
    // Mock data
    const players = [
        { name: 'Rohan V.', score: 4850, rank: 1 },
        { name: 'Priya S.', score: 4700, rank: 2 },
        { name: 'You', score: 4250, rank: 3 },
        { name: 'Aisha K.', score: 4100, rank: 4 },
    ];

    return (
        <div className="bg-white p-6 rounded-2xl shadow-md">
            <div className="flex items-center space-x-2 mb-4">
                <TrophyIcon className="w-6 h-6 text-brand-secondary" />
                <h3 className="font-bold text-xl text-brand-dark">Leaderboard</h3>
            </div>
            <ul className="space-y-3">
                {players.map(player => (
                    <li key={player.rank} className={`flex items-center justify-between p-3 rounded-lg ${player.name === 'You' ? 'bg-brand-primary text-white' : 'bg-brand-light'}`}>
                        <div className="flex items-center space-x-3">
                            <span className="font-bold text-lg w-6">{player.rank}</span>
                            <span className="font-semibold">{player.name}</span>
                        </div>
                        <span className="font-bold">{player.score} pts</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

interface AthleteDashboardProps {
  athlete: AthleteProfile;
}

const AthleteDashboard: React.FC<AthleteDashboardProps> = ({ athlete }) => {
    const [profile, setProfile] = useState<AthleteProfile>(athlete);
    const [aiFeedback, setAiFeedback] = useState<string>('');
    const [isLoadingFeedback, setIsLoadingFeedback] = useState<boolean>(false);

    const handleTestCompletion = (testId: string, score: number) => {
        setProfile(prevProfile => {
            const newResults = [...prevProfile.results];
            const resultIndex = newResults.findIndex(r => r.testId === testId);
            const newHistoryEntry = { date: new Date().toISOString().split('T')[0], value: score };

            if (resultIndex > -1) {
                newResults[resultIndex] = {
                    ...newResults[resultIndex],
                    latestScore: score,
                    history: [...newResults[resultIndex].history, newHistoryEntry]
                };
            } else {
                 newResults.push({
                    testId,
                    latestScore: score,
                    benchmark: Math.floor(score * 0.9), // Mock benchmark
                    percentile: Math.floor(Math.random() * 30) + 70, // Mock percentile
                    history: [newHistoryEntry]
                });
            }
            return { ...prevProfile, results: newResults };
        });
    };

    const handleGetFeedback = useCallback(async () => {
        setIsLoadingFeedback(true);
        setAiFeedback('');
        const feedback = await generatePersonalizedFeedback(profile);
        setAiFeedback(feedback);
        setIsLoadingFeedback(false);
    }, [profile]);


  return (
    <main className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="text-center md:text-left">
        <h2 className="text-3xl font-extrabold text-brand-dark">Welcome back, {profile.firstName}!</h2>
        <p className="text-brand-gray mt-1">Ready to test your limits? Let's get started.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
            {FITNESS_TESTS.map(test => (
                <FitnessTestCard 
                    key={test.id} 
                    test={test} 
                    result={profile.results.find(r => r.testId === test.id)}
                    onTestComplete={handleTestCompletion}
                />
            ))}
        </div>
        <div className="space-y-6">
          <Leaderboard />
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="font-bold text-xl text-brand-dark mb-4">AI-Powered Feedback</h3>
                <button onClick={handleGetFeedback} disabled={isLoadingFeedback} className="w-full bg-brand-secondary text-brand-dark font-bold py-2 px-6 rounded-lg hover:bg-opacity-90 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed">
                  {isLoadingFeedback ? 'Generating...' : 'Get My Personal Feedback'}
                </button>
                {aiFeedback && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg whitespace-pre-wrap font-sans text-brand-dark">
                    {aiFeedback}
                  </div>
                )}
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="font-bold text-xl text-brand-dark mb-4">Progress Badges</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center text-white"><TrophyIcon className="w-8 h-8" /></div>
                    <p className="text-xs mt-2 font-semibold">First Test</p>
                </div>
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-white"><TrophyIcon className="w-8 h-8" /></div>
                    <p className="text-xs mt-2 text-brand-gray">Speedster</p>
                </div>
                 <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-white"><TrophyIcon className="w-8 h-8" /></div>
                    <p className="text-xs mt-2 text-brand-gray">Power House</p>
                </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AthleteDashboard;
