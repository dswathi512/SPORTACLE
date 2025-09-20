import React, { useState, useCallback, useMemo, FC, useRef, useEffect } from 'react';
import { useLanguage } from '../App';
import { HeightWeightData } from '../types';
import { FaTrophy, FaVideo } from 'react-icons/fa';
import Modal from './Modal';

const MAX_FILE_SIZE_MB = 100;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/avi'];

interface VideoUploadWidgetProps {
    title: string;
    onFileSelect: (file: File | null) => void;
    id: string;
}

const VideoUploadWidget: FC<VideoUploadWidgetProps> = ({ title, onFileSelect, id }) => {
    const { t } = useLanguage();
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState('');
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState<'idle' | 'uploading' | 'processing' | 'complete' | 'error'>('idle');
    const [isDragActive, setIsDragActive] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    const handleFile = (selectedFile: File) => {
        if (!ALLOWED_VIDEO_TYPES.includes(selectedFile.type)) {
            setError(t('error_invalid_file_type'));
            setStatus('error');
            return;
        }
        if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
            setError(t('error_file_too_large', { size: MAX_FILE_SIZE_MB }));
            setStatus('error');
            return;
        }

        setError('');
        setFile(selectedFile);
        onFileSelect(selectedFile);
        setStatus('uploading');
        setPreviewUrl(URL.createObjectURL(selectedFile));

        // Simulate upload progress
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setStatus('processing');
                    setTimeout(() => setStatus('complete'), 1500);
                    return 100;
                }
                return prev + 10;
            });
        }, 200);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };
    
    const dragProps = {
        onDragEnter: (e: React.DragEvent<HTMLElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragActive(true); },
        onDragLeave: (e: React.DragEvent<HTMLElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragActive(false); },
        onDragOver: (e: React.DragEvent<HTMLElement>) => { e.preventDefault(); e.stopPropagation(); },
        onDrop: (e: React.DragEvent<HTMLElement>) => {
            e.preventDefault(); e.stopPropagation(); setIsDragActive(false);
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleFile(e.dataTransfer.files[0]);
            }
        },
    };

    const getStatusMessage = () => {
        switch (status) {
            case 'uploading': return t('upload_status_uploading', { progress });
            case 'processing': return t('upload_status_processing');
            case 'complete': return t('upload_status_complete');
            case 'error': return error || t('upload_status_error');
            default: return t('upload_or_drag');
        }
    };
    
    const statusColorClasses = {
        idle: 'border-gray-300 text-brand-gray',
        uploading: 'border-blue-500 text-blue-600',
        processing: 'border-purple-500 text-purple-600',
        complete: 'border-green-500 text-green-600',
        error: 'border-red-500 text-red-600',
    };

    return (
        <div className="w-full">
            <p className="block text-sm font-medium text-brand-gray mb-1">{title}</p>
            <div 
                {...dragProps}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${isDragActive ? 'bg-blue-50 border-brand-primary' : 'bg-white'} ${statusColorClasses[status]}`}
            >
                <input type="file" id={id} ref={fileInputRef} onChange={handleFileChange} className="hidden" accept={ALLOWED_VIDEO_TYPES.join(',')} />
                <FaVideo className="w-10 h-10 mx-auto" />
                <p className={`mt-2 text-sm font-semibold`}>
                    {isDragActive ? t('upload_drag_active') : getStatusMessage()}
                </p>
                {status !== 'complete' && <p className="text-xs text-gray-500 mt-1">MP4, MOV, AVI up to {MAX_FILE_SIZE_MB}MB</p>}
                
                {status === 'uploading' && (
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                        <div className="bg-brand-primary h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                )}
            </div>
            {previewUrl && status ==='complete' && (
                 <div className="mt-2">
                    <video src={previewUrl} controls className="w-full rounded-lg max-h-40" />
                </div>
            )}
        </div>
    );
};

interface HeightWeightEntryProps {
    onSubmit: (data: HeightWeightData) => void;
}

const HeightWeightEntry: React.FC<HeightWeightEntryProps> = ({ onSubmit }) => {
    const { t, language } = useLanguage();
    const [heightFile, setHeightFile] = useState<File | null>(null);
    const [weightFile, setWeightFile] = useState<File | null>(null);
    const [heightUnit, setHeightUnit] = useState<'cm' | 'ft'>('cm');
    const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('kg');
    const [heightCm, setHeightCm] = useState('');
    const [heightFt, setHeightFt] = useState('');
    const [heightIn, setHeightIn] = useState('');
    const [weightKg, setWeightKg] = useState('');
    const [weightLbs, setWeightLbs] = useState('');
    const [error, setError] = useState('');
    const [isHeightInstructionsOpen, setIsHeightInstructionsOpen] = useState(false);
    const [isWeightInstructionsOpen, setIsWeightInstructionsOpen] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!heightFile || !weightFile || !heightCm || !weightKg) {
            setError(t('error_all_fields_required'));
            return;
        }
        
        const heightNum = parseFloat(heightCm);
        const weightNum = parseFloat(weightKg);

        if (isNaN(heightNum) || heightNum < 50 || heightNum > 250) {
            setError(t('error_invalid_height'));
            return;
        }
        if (isNaN(weightNum) || weightNum < 10 || weightNum > 250) {
            setError(t('error_invalid_weight'));
            return;
        }

        const finalHeight = heightUnit === 'cm' ? heightNum : (parseFloat(heightFt) || 0) + (parseFloat(heightIn) || 0) / 12;
        const finalWeight = weightUnit === 'kg' ? weightNum : parseFloat(weightLbs) || 0;
        
        onSubmit({
            height: finalHeight,
            heightUnit,
            weight: finalWeight,
            weightUnit,
            heightVideoUrl: 'mock_url_height.mp4',
            weightVideoUrl: 'mock_url_weight.mp4',
        });
    };
    
    // Conversion Handlers
    const handleHeightChange = (val: string, unit: 'cm' | 'ft' | 'in') => {
        const num = parseFloat(val);
        if (unit === 'cm') {
            setHeightCm(val);
            if (!isNaN(num)) {
                const totalInches = num / 2.54;
                setHeightFt(Math.floor(totalInches / 12).toString());
                setHeightIn((totalInches % 12).toFixed(1));
            } else {
                setHeightFt(''); setHeightIn('');
            }
        } else { // ft or in
            let currentFt = unit === 'ft' ? num : parseFloat(heightFt) || 0;
            let currentIn = unit === 'in' ? num : parseFloat(heightIn) || 0;
            if (unit === 'ft') setHeightFt(val);
            if (unit === 'in') setHeightIn(val);

            if (!isNaN(currentFt) || !isNaN(currentIn)) {
                const totalInches = (currentFt || 0) * 12 + (currentIn || 0);
                setHeightCm((totalInches * 2.54).toFixed(1));
            } else {
                setHeightCm('');
            }
        }
    };

    const handleWeightChange = (val: string, unit: 'kg' | 'lbs') => {
        const num = parseFloat(val);
        if (unit === 'kg') {
            setWeightKg(val);
            if (!isNaN(num)) setWeightLbs((num * 2.20462).toFixed(1));
            else setWeightLbs('');
        } else { // lbs
            setWeightLbs(val);
            if (!isNaN(num)) setWeightKg((num / 2.20462).toFixed(1));
            else setWeightKg('');
        }
    };


    return (
        <div className="min-h-screen bg-brand-light flex flex-col items-center p-4">
             <div className="w-full max-w-4xl mx-auto">
                <div className="text-center my-8">
                    <FaTrophy className="w-16 h-16 text-brand-primary mx-auto" />
                    <h1 className="mt-4 text-3xl font-extrabold text-brand-dark">{t('hw_title')}</h1>
                    <p className="mt-2 text-brand-gray">{t('hw_subtitle')}</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg space-y-8">
                    {/* Height Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start p-6 border border-gray-200 rounded-lg">
                        <div>
                            <h3 className="text-xl font-bold text-brand-dark">{t('hw_height_section_title')}</h3>
                            <button type="button" onClick={() => setIsHeightInstructionsOpen(true)} className="text-sm text-brand-primary hover:underline">{t('button_view_instructions')}</button>
                            <div className="mt-4">
                               <VideoUploadWidget id="height-video" title={t('hw_upload_height_video')} onFileSelect={setHeightFile} />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-brand-dark mb-2">{t('hw_manual_entry_title')}</h3>
                            <div className="flex items-center space-x-2 mb-2">
                                <span className="text-sm font-medium text-brand-gray">{t('hw_label_height')}:</span>
                                <button type="button" onClick={() => setHeightUnit('cm')} className={`px-3 py-1 text-sm rounded-full ${heightUnit === 'cm' ? 'bg-brand-primary text-white' : 'bg-gray-200'}`}>{t('hw_unit_cm')}</button>
                                <button type="button" onClick={() => setHeightUnit('ft')} className={`px-3 py-1 text-sm rounded-full ${heightUnit === 'ft' ? 'bg-brand-primary text-white' : 'bg-gray-200'}`}>{t('hw_unit_ft')}</button>
                            </div>
                            {heightUnit === 'cm' ? (
                                <input type="number" value={heightCm} onChange={(e) => handleHeightChange(e.target.value, 'cm')} placeholder={t('hw_placeholder_cm')} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                            ) : (
                                <div className="flex space-x-2">
                                    <input type="number" value={heightFt} onChange={(e) => handleHeightChange(e.target.value, 'ft')} placeholder={t('hw_placeholder_ft')} className="w-1/2 px-3 py-2 border border-gray-300 rounded-md" />
                                    <input type="number" value={heightIn} onChange={(e) => handleHeightChange(e.target.value, 'in')} placeholder={t('hw_placeholder_in')} className="w-1/2 px-3 py-2 border border-gray-300 rounded-md" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Weight Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start p-6 border border-gray-200 rounded-lg">
                         <div>
                            <h3 className="text-xl font-bold text-brand-dark">{t('hw_weight_section_title')}</h3>
                            <button type="button" onClick={() => setIsWeightInstructionsOpen(true)} className="text-sm text-brand-primary hover:underline">{t('button_view_instructions')}</button>
                            <div className="mt-4">
                                <VideoUploadWidget id="weight-video" title={t('hw_upload_weight_video')} onFileSelect={setWeightFile} />
                            </div>
                        </div>
                        <div>
                             <h3 className="text-lg font-semibold text-brand-dark mb-2">{t('hw_manual_entry_title')}</h3>
                            <div className="flex items-center space-x-2 mb-2">
                                <span className="text-sm font-medium text-brand-gray">{t('hw_label_weight')}:</span>
                                <button type="button" onClick={() => setWeightUnit('kg')} className={`px-3 py-1 text-sm rounded-full ${weightUnit === 'kg' ? 'bg-brand-primary text-white' : 'bg-gray-200'}`}>{t('hw_unit_kg')}</button>
                                <button type="button" onClick={() => setWeightUnit('lbs')} className={`px-3 py-1 text-sm rounded-full ${weightUnit === 'lbs' ? 'bg-brand-primary text-white' : 'bg-gray-200'}`}>{t('hw_unit_lbs')}</button>
                            </div>
                            {weightUnit === 'kg' ? (
                                <input type="number" value={weightKg} onChange={(e) => handleWeightChange(e.target.value, 'kg')} placeholder={t('hw_placeholder_kg')} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                            ) : (
                                <input type="number" value={weightLbs} onChange={(e) => handleWeightChange(e.target.value, 'lbs')} placeholder={t('hw_placeholder_lbs')} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                            )}
                        </div>
                    </div>
                    
                    {error && <p className="text-red-600 text-center font-semibold">{error}</p>}

                    <div className="text-center pt-4">
                        <button type="submit" className="w-full max-w-xs py-3 px-6 bg-brand-primary text-white font-bold rounded-lg text-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400">
                           {t('button_save_continue')}
                        </button>
                    </div>
                </form>
             </div>
              <Modal isOpen={isHeightInstructionsOpen} onClose={() => setIsHeightInstructionsOpen(false)} title={t('hw_instructions_title_height')}>
                <div className="space-y-4 text-brand-dark">
                    <div>
                        <h4 className="font-bold text-md mb-1">{t('modal_how_to_perform')}</h4>
                        <p className="text-sm text-brand-gray">{t('hw_instructions_perform_height')}</p>
                    </div>
                    <div>
                        <h4 className="font-bold text-md mb-1">{t('modal_how_to_record')}</h4>
                        <p className="text-sm text-brand-gray">{t('hw_instructions_record_height')}</p>
                    </div>
                    <div>
                        <h4 className="font-bold text-md mb-1">{t('modal_how_we_assess')}</h4>
                        <p className="text-sm text-brand-gray">{t('hw_instructions_assess_height')}</p>
                    </div>
                </div>
            </Modal>
             <Modal isOpen={isWeightInstructionsOpen} onClose={() => setIsWeightInstructionsOpen(false)} title={t('hw_instructions_title_weight')}>
                 <div className="space-y-4 text-brand-dark">
                    <div>
                        <h4 className="font-bold text-md mb-1">{t('modal_how_to_perform')}</h4>
                        <p className="text-sm text-brand-gray">{t('hw_instructions_perform_weight')}</p>
                    </div>
                    <div>
                        <h4 className="font-bold text-md mb-1">{t('modal_how_to_record')}</h4>
                        <p className="text-sm text-brand-gray">{t('hw_instructions_record_weight')}</p>
                    </div>
                    <div>
                        <h4 className="font-bold text-md mb-1">{t('modal_how_we_assess')}</h4>
                        <p className="text-sm text-brand-gray">{t('hw_instructions_assess_weight')}</p>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default HeightWeightEntry;