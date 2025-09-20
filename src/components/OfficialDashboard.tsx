import React from 'react';
import { MOCK_ATHLETES } from '../constants';
import { Sport, AthleteProfile } from '../types';
import { DistributionBarChart } from './ProgressChart';
import { FaChartBar } from 'react-icons/fa';
import { useLanguage } from '../App';

const OfficialDashboard: React.FC = () => {
  const { t } = useLanguage();
  const athletes: AthleteProfile[] = MOCK_ATHLETES;

  const athletesBySport = Object.values(Sport).map(sport => ({
    name: sport,
    value: athletes.filter(a => a.sport === sport).length,
  })).filter(s => s.value > 0);

  const topPerformingAthletes = [...athletes]
    .sort((a, b) => {
        const avgPercentileA = a.results.reduce((sum, r) => sum + r.percentile, 0) / a.results.length;
        const avgPercentileB = b.results.reduce((sum, r) => sum + r.percentile, 0) / b.results.length;
        return avgPercentileB - avgPercentileA;
    })
    .slice(0, 5);

  return (
    <main className="container mx-auto p-4 md:p-6 space-y-8">
      <div className="flex items-center space-x-3">
        <FaChartBar className="w-10 h-10 text-brand-primary" />
        <div>
          <h2 className="text-3xl font-extrabold text-brand-dark">{t('official_dashboard_title')}</h2>
          <p className="text-brand-gray">{t('official_dashboard_subtitle')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="font-bold text-xl text-brand-dark mb-4">{t('distribution_by_sport_title')}</h3>
          <DistributionBarChart data={athletesBySport} />
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="font-bold text-xl text-brand-dark mb-4">{t('top_5_athletes_title')}</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-brand-dark">
              <thead className="text-xs text-brand-gray uppercase bg-brand-light">
                <tr>
                  <th scope="col" className="px-6 py-3">{t('table_header_rank')}</th>
                  <th scope="col" className="px-6 py-3">{t('table_header_athlete')}</th>
                  <th scope="col" className="px-6 py-3">{t('table_header_sport')}</th>
                  <th scope="col" className="px-6 py-3 text-right">{t('table_header_avg_percentile')}</th>
                </tr>
              </thead>
              <tbody>
                {topPerformingAthletes.map((athlete, index) => {
                   const avgPercentile = Math.round(athlete.results.reduce((sum, r) => sum + r.percentile, 0) / athlete.results.length);
                   return (
                    <tr key={athlete.id} className="bg-white border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-bold">{index + 1}</td>
                      <td className="px-6 py-4 font-semibold">{athlete.firstName} {athlete.lastName}</td>
                      <td className="px-6 py-4">{athlete.sport}</td>
                      <td className="px-6 py-4 text-right font-bold text-brand-primary">{avgPercentile}%</td>
                    </tr>
                   )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
};

export default OfficialDashboard;