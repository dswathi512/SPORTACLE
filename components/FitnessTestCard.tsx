
import React, { useState, useRef } from 'react';
import { FitnessTest, TestResult, TestName } from '../types';
import Modal from './Modal';
import VideoPlayer from './VideoPlayer';
import VideoCameraIcon from './icons/VideoCameraIcon';
import { ProgressLineChart } from './ProgressChart';

interface FitnessTestCardProps {
  test: FitnessTest;
  result?: TestResult;
  onTestComplete: (testId: string, score: number) => void;
}

const FitnessTestCard: React.FC<FitnessTestCardProps> = ({ test, result, onTestComplete }) => {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isInputModalOpen, setIsInputModalOpen] = useState(false);
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{ score: number; feedback: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleRecordClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setIsAnalyzing(true);
      setAnalysisResult(null);
      // Simulate AI/ML analysis
      setTimeout(() => {
        const mockScore = Math.floor(Math.random() * 50) + 10; // Random score
        const feedback = `AI analysis complete. Detected ${mockScore} ${test.unit}. Great form!`;
        setAnalysisResult({ score: mockScore, feedback });
        onTestComplete(test.id, mockScore);
        setIsAnalyzing(false);
      }, 3000);
    }
  };

  const handleManualSubmit = () => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (!isNaN(h) && !isNaN(w) && h > 0 && w > 0 && w < 1000) {
      // Encode height and weight into a single number
      const combinedScore = h * 1000 + w;
      onTestComplete(test.id, combinedScore);
      setIsInputModalOpen(false);
      setHeight('');
      setWeight('');
    } else {
      alert('Please enter valid, positive numbers for height and weight (weight must be less than 1000kg).');
    }
  };

  const decodeScore = (score: number) => {
    if (test.name !== TestName.HEIGHT_WEIGHT) {
        return { displayScore: score, displayUnit: test.unit };
    }
    // Handle 0 or invalid encoded scores for H&W
    if (!score || score < 1000) {
        return { displayScore: 'N/A', displayUnit: '' };
    }
    const h = Math.floor(score / 1000);
    const w = score % 1000;
    return { displayScore: `${h}cm / ${w}kg`, displayUnit: '' };
  };

  const scoreInfo = result ? decodeScore(result.latestScore) : null;
  
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden transition-transform hover:scale-105 duration-300">
      <div className="p-5">
        <h3 className="font-bold text-lg text-brand-dark">{test.name}</h3>
        <p className="text-sm text-brand-gray mt-1">{test.description}</p>
        
        {result && scoreInfo ? (
          <div className="mt-4 bg-brand-light p-4 rounded-lg">
            <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-brand-dark">Latest Value:</span>
                <span className="font-bold text-brand-primary text-lg">{scoreInfo.displayScore} <span className="text-xs font-normal">{scoreInfo.displayUnit}</span></span>
            </div>
            {test.name !== TestName.HEIGHT_WEIGHT && (
              <>
                <div className="flex justify-between items-center text-sm mt-1">
                    <span className="font-semibold text-brand-dark">Benchmark:</span>
                    <span className="text-brand-gray">{result.benchmark} <span className="text-xs">{test.unit}</span></span>
                </div>
                <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-brand-secondary h-2.5 rounded-full" style={{ width: `${result.percentile}%` }}></div>
                    </div>
                    <p className="text-right text-xs mt-1 text-brand-secondary font-semibold">Top {100 - result.percentile}%</p>
                </div>
              </>
            )}
          </div>
        ) : (
            <div className="mt-4 text-center text-brand-gray italic bg-brand-light p-4 rounded-lg">No data recorded yet.</div>
        )}
        
        {result && result.history.length > 1 && test.name !== TestName.HEIGHT_WEIGHT && (
            <div className="mt-4">
                <h4 className="text-sm font-semibold text-brand-dark mb-2">Your Progress</h4>
                <ProgressLineChart data={result.history} unit={test.unit} />
            </div>
        )}

        <div className="mt-4 flex">
          {test.name === TestName.HEIGHT_WEIGHT ? (
             <button onClick={() => setIsInputModalOpen(true)} className="w-full py-2 px-4 bg-brand-primary text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 text-sm">
                <span>Update Manually</span>
             </button>
          ) : (
            <div className="flex space-x-2 w-full">
                <button onClick={() => setIsDemoModalOpen(true)} className="flex-1 py-2 px-4 bg-gray-100 text-brand-dark font-semibold rounded-lg hover:bg-gray-200 transition-colors text-sm">
                View Demo
                </button>
                <button onClick={handleRecordClick} disabled={isAnalyzing} className="flex-1 py-2 px-4 bg-brand-primary text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 disabled:bg-gray-400 text-sm">
                    <VideoCameraIcon className="w-5 h-5" />
                    <span>{isAnalyzing ? 'Analyzing...' : 'Record Test'}</span>
                </button>
            </div>
          )}
          <input type="file" accept="video/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
        </div>
        {analysisResult && (
            <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-lg text-sm">
                {analysisResult.feedback}
            </div>
        )}
      </div>

      <Modal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} title={test.name}>
        <VideoPlayer src={test.videoUrl} title={test.name} />
        <p className="mt-4 text-brand-gray">{test.description}</p>
      </Modal>

      <Modal isOpen={isInputModalOpen} onClose={() => setIsInputModalOpen(false)} title="Update Height & Weight">
        <div className="space-y-4">
            <div>
                <label htmlFor="height" className="block text-sm font-medium text-brand-gray">Height (cm)</label>
                <input
                  type="number"
                  id="height"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                  placeholder="e.g., 175"
                />
            </div>
            <div>
                <label htmlFor="weight" className="block text-sm font-medium text-brand-gray">Weight (kg)</label>
                <input
                  type="number"
                  id="weight"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                  placeholder="e.g., 68"
                />
            </div>
            <button
                onClick={handleManualSubmit}
                className="w-full py-2 px-4 bg-brand-primary text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
                Save
            </button>
        </div>
      </Modal>
    </div>
  );
};

export default FitnessTestCard;
