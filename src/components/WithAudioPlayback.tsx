"use client";

import React, { useEffect } from 'react';
import useAudioStore from '@/store/useAudioStore';

interface WithAudioPlaybackProps {
  children: React.ReactNode;
}

export const WithAudioPlayback: React.FC<WithAudioPlaybackProps> = ({ children }) => {
  const { initializeAudio, connectToRealtimeAPI, disconnectFromRealtimeAPI } = useAudioStore();

  useEffect(() => {
    initializeAudio();
    connectToRealtimeAPI();

    return () => {
      disconnectFromRealtimeAPI();
    };
  }, [initializeAudio, connectToRealtimeAPI, disconnectFromRealtimeAPI]);

  return <>{children}</>;
};
