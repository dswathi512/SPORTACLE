import React, { useState, useCallback } from 'react';
import { AthleteProfile } from '../types';
import { FITNESS_TESTS } from '../constants';
import FitnessTestCard from './FitnessTestCard';
import { FaTrophy } from 'react-icons/fa';
import { generatePersonalizedFeedback } from '../services/geminiService';
import { useLanguage } from '../App';

const Leaderboard: React.FC = () => {
    const { t } = useLanguage();
    // Mock data
    const players = [
        { name: 'Rohan V.', score: 4850, rank: 1 },
        { name: 'Priya S.', score: 4700, rank: 2 },
        { name: t('leaderboard_you'), score: 4250, rank: 3 },
        { name: 'Aisha K.', score: 4100, rank: 4 },
    ];

    return (
        <div className="bg-white p-6 rounded-2xl shadow-md">
            <div className="flex items-center space-x-2 mb-4">
                <FaTrophy className="w-6 h-6 text-brand-secondary" />
                <h3 className="font-bold text-xl text-brand-dark">{t('leaderboard_title')}</h3>
            </div>
            <ul className="space-y-3">
                {players.map(player => (
                    <li key={player.rank} className={`flex items-center justify-between p-3 rounded-lg ${player.name === t('leaderboard_you') ? 'bg-brand-primary text-white' : 'bg-brand-light'}`}>
                        <div className="flex items-center space-x-3">
                            <span className="font-bold text-lg w-6">{player.rank}</span>
                            <span className="font-semibold">{player.name}</span>
                        </div>
                        <span className="font-bold">{player.score} {t('leaderboard_pts')}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const MeasurementDisplay: React.FC<{ athlete: AthleteProfile }> = ({ athlete }) => {
    const { t } = useLanguage();
    if (!athlete.heightWeight) return null;

    const { height, heightUnit, weight, weightUnit } = athlete.heightWeight;

    const formatHeight = () => {
        if (heightUnit === 'ft') {
            const feet = Math.floor(height);
            const inches = Math.round((height - feet) * 12);
            return `${feet}' ${inches}"`;
        }
        return `${height} cm`;
    }

     const formatWeight = () => {
        return `${weight} ${weightUnit}`;
    }

    return (
        <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="font-bold text-xl text-brand-dark mb-4">{t('your_measurements')}</h3>
            <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                    <p className="text-sm text-brand-gray">{t('height')}</p>
                    <p className="text-2xl font-bold text-brand-primary">{formatHeight()}</p>
                </div>
                <div>
                    <p className="text-sm text-brand-gray">{t('weight')}</p>
                    <p className="text-2xl font-bold text-brand-primary">{formatWeight()}</p>
                </div>
            </div>
        </div>
    )
}

interface AthleteDashboardProps {
  athlete: AthleteProfile;
}

const AthleteDashboard: React.FC<AthleteDashboardProps> = ({ athlete }) => {
    const { t, language } = useLanguage();
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
        <h2 className="text-3xl font-extrabold text-brand-dark">{t('welcome_back', { name: profile.firstName })}</h2>
        <p className="text-brand-gray mt-1">{t('dashboard_subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
            {FITNESS_TESTS.map(test => (
                <FitnessTestCard 
                    key={test.id} 
                    test={test} 
                    result={profile.results.find(r => r.testId === test.id)}
                    onTestComplete={handleTestCompletion}
                    language={language}
                />
            ))}
        </div>
        <div className="space-y-6">
          <MeasurementDisplay athlete={profile}/>
          <Leaderboard />
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="font-bold text-xl text-brand-dark mb-4">{t('feedback_title')}</h3>
                <button onClick={handleGetFeedback} disabled={isLoadingFeedback} className="w-full bg-brand-secondary text-brand-dark font-bold py-2 px-6 rounded-lg hover:bg-opacity-90 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed">
                  {isLoadingFeedback ? t('button_generating') : t('button_get_feedback')}
                </button>
                {aiFeedback && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg whitespace-pre-wrap font-sans text-brand-dark">
                    {aiFeedback}
                  </div>
                )}
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="font-bold text-xl text-brand-dark mb-4">{t('badges_title')}</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center text-white"><FaTrophy className="w-8 h-8" /></div>
                    <p className="text-xs mt-2 font-semibold">{t('badge_first_test')}</p>
                </div>
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-white"><FaTrophy className="w-8 h-8" /></div>
                    <p className="text-xs mt-2 text-brand-gray">{t('badge_speedster')}</p>
                </div>
                 <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-white"><FaTrophy className="w-8 h-8" /></div>
                    <p className="text-xs mt-2 text-brand-gray">{t('badge_power_house')}</p>
                </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AthleteDashboard;