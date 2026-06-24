import React from 'react';
import {
  AbsoluteFill,
  OffthreadVideo,
  Html5Video, staticFile
} from 'remotion';

export const VideoBackground: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* Video de fondo */}
      <OffthreadVideo
        src={staticFile('tablet.mp4')}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />

      {/* Capa oscura opcional */}
      <AbsoluteFill
        style={{
          backgroundColor: 'rgba(0,0,0,0.4)',
        }}
      />

      {/* Contenido encima */}
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          fontSize: 80,
          fontWeight: 'bold',
        }}
      >
        Mi Video
      </AbsoluteFill>
    </AbsoluteFill>
  );
};