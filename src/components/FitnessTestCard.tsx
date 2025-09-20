import React, { useState, useRef, useEffect } from 'react';
import { FitnessTest, TestResult, Language } from '../types';
import Modal from './Modal';
import VideoPlayer from './VideoPlayer';
import { FaVideo } from 'react-icons/fa';
import { ProgressLineChart } from './ProgressChart';
import { useLanguage } from '../App';

interface FitnessTestCardProps {
  test: FitnessTest;
  result?: TestResult;
  onTestComplete: (testId: string, score: number) => void;
  language: Language;
}

const MAX_FILE_SIZE_MB = 100;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/avi'];

const FitnessTestCard: React.FC<FitnessTestCardProps> = ({ test, result, onTestComplete, language }) => {
  const { t } = useLanguage();
  const [isInstructionsModalOpen, setIsInstructionsModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{ score: number; feedback: string } | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Clean up the object URL when the component unmounts or the URL changes
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleRecordClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        // Front-load validation
        if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
            alert(t('error_invalid_file_type'));
            event.target.value = '';
            return;
        }
        if (file.size > MAX_FILE_SIZE_BYTES) {
            alert(t('error_file_too_large', { size: MAX_FILE_SIZE_MB }));
            event.target.value = '';
            return;
        }

      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setSelectedFile(file);
      setIsPreviewModalOpen(true);
      event.target.value = ''; // Reset file input to allow re-selection of the same file
    }
  };

  const handleSubmitVideo = () => {
    if (!selectedFile) return;

    setIsPreviewModalOpen(false);
    setIsAnalyzing(true);
    setAnalysisResult(null);
    
    setTimeout(() => {
      const mockScore = Math.floor(Math.random() * 50) + 10;
      const feedback = t('analysis_feedback', { score: mockScore, unit: test.unit });
      setAnalysisResult({ score: mockScore, feedback });
      onTestComplete(test.id, mockScore);
      setIsAnalyzing(false);
      setSelectedFile(null);
      if(previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl('');
    }, 3000);
  };
  
  const decodeScore = (score: number) => {
    if (!score) {
        return { displayScore: t('status_na'), displayUnit: '' };
    }
    return { displayScore: score, displayUnit: test.unit };
  };

  const scoreInfo = result ? decodeScore(result.latestScore) : null;
  const instructions = test.instructions[language];
  const testName = t(`test_name_${test.name}`);

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden transition-transform hover:scale-105 duration-300">
      <div className="p-5">
        <h3 className="font-bold text-lg text-brand-dark">{testName}</h3>
        <p className="text-sm text-brand-gray mt-1">{t(test.descriptionKey)}</p>
        
        {result && scoreInfo ? (
          <div className="mt-4 bg-brand-light p-4 rounded-lg">
            <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-brand-dark">{t('card_latest_value')}:</span>
                <span className="font-bold text-brand-primary text-lg">{scoreInfo.displayScore} <span className="text-xs font-normal">{scoreInfo.displayUnit}</span></span>
            </div>
            
            <div className="flex justify-between items-center text-sm mt-1">
                <span className="font-semibold text-brand-dark">{t('card_benchmark')}:</span>
                <span className="text-brand-gray">{result.benchmark} <span className="text-xs">{test.unit}</span></span>
            </div>
            <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-brand-secondary h-2.5 rounded-full" style={{ width: `${result.percentile}%` }}></div>
                </div>
                <p className="text-right text-xs mt-1 text-brand-secondary font-semibold">{t('card_top_percentile', { percentile: 100 - result.percentile })}</p>
            </div>
          </div>
        ) : (
            <div className="mt-4 text-center text-brand-gray italic bg-brand-light p-4 rounded-lg">{t('card_no_data')}</div>
        )}
        
        {result && result.history.length > 1 && (
            <div className="mt-4">
                <h4 className="text-sm font-semibold text-brand-dark mb-2">{t('card_your_progress')}</h4>
                <ProgressLineChart data={result.history} unit={test.unit} />
            </div>
        )}

        <div className="mt-4 flex">
            <div className="flex space-x-2 w-full">
                <button onClick={() => setIsInstructionsModalOpen(true)} className="flex-1 py-2 px-4 bg-gray-100 text-brand-dark font-semibold rounded-lg hover:bg-gray-200 transition-colors text-sm">
                {t('button_view_instructions')}
                </button>
                <button onClick={handleRecordClick} disabled={isAnalyzing} className="flex-1 py-2 px-4 bg-brand-primary text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 disabled:bg-gray-400 text-sm">
                    <FaVideo className="w-5 h-5" />
                    <span>
                        {isAnalyzing 
                            ? t('button_analyzing') 
                            : t('button_record_test')
                        }
                    </span>
                </button>
            </div>
          <input type="file" accept="video/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
        </div>
        {analysisResult && (
            <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-lg text-sm">
                {analysisResult.feedback}
            </div>
        )}
      </div>

      <Modal isOpen={isInstructionsModalOpen} onClose={() => setIsInstructionsModalOpen(false)} title={t('modal_instructions_title', { testName })}>
        <VideoPlayer src={test.videoUrl} title={t('video_demo_title', { testName })} />
        <div className="mt-6 space-y-4 text-brand-dark">
            <div>
                <h4 className="font-bold text-md mb-1">{t('modal_how_to_perform')}</h4>
                <p className="text-sm text-brand-gray">{instructions.perform}</p>
            </div>
            <div>
                <h4 className="font-bold text-md mb-1">{t('modal_how_to_record')}</h4>
                <p className="text-sm text-brand-gray">{instructions.record}</p>
            </div>
            <div>
                <h4 className="font-bold text-md mb-1">{t('modal_how_we_assess')}</h4>
                <p className="text-sm text-brand-gray">{instructions.assess}</p>
            </div>
        </div>
      </Modal>

      <Modal isOpen={isPreviewModalOpen} onClose={() => setIsPreviewModalOpen(false)} title={t('modal_preview_title')}>
        {previewUrl && (
          <video src={previewUrl} controls className="w-full rounded-lg" />
        )}
        <div className="mt-4 flex justify-end space-x-2">
            <button onClick={() => setIsPreviewModalOpen(false)} className="py-2 px-4 bg-gray-200 text-brand-dark font-semibold rounded-lg hover:bg-gray-300">
                {t('button_cancel')}
            </button>
            <button onClick={handleSubmitVideo} className="py-2 px-4 bg-brand-primary text-white font-semibold rounded-lg hover:bg-blue-700">
                {t('button_submit_analysis')}
            </button>
        </div>
      </Modal>
    </div>
  );
};

export default FitnessTestCard;