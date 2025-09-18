
import React from 'react';

interface VideoPlayerProps {
  src: string;
  title: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, title }) => {
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
          Your browser does not support the video tag.
        </video>
      </div>
      <p className="mt-2 text-sm text-brand-gray text-center">Demonstration for {title}</p>
    </div>
  );
};

export default VideoPlayer;
