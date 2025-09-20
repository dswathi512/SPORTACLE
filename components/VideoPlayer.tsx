import React from 'react';
import { useLanguage } from '../App';

interface VideoPlayerProps {
  src: string;
  title: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, title }) => {
  const { t } = useLanguage();
  return (
    <div className="w-full">
      <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden bg-black">
        <video
          src={src}
          title={title}
          controls
          autoPlay
          loop
          muted
          className="w-full h-full object-cover"
        >
          {t('video_unsupported')}
        </video>
      </div>
      <p className="mt-2 text-sm text-brand-gray text-center">{t('video_demonstration_for', { title })}</p>
    </div>
  );
};

export default VideoPlayer;