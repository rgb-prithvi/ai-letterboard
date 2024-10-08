"use client";

import React, { useEffect, useRef, useState } from 'react';
import { createAudioBuffer, playAudioBuffer, getAudioDataFromJson } from '@/lib/audio-utils';

const TestAudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const audioDataRef = useRef<Record<string, number> | null>(null);

  useEffect(() => {
    // Initialize AudioContext
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();

    // Get audio data
    audioDataRef.current = getAudioDataFromJson();

    // Cleanup function
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const handlePlay = () => {
    if (!audioContextRef.current || !audioDataRef.current) return;

    const buffer = createAudioBuffer(audioContextRef.current, audioDataRef.current);
    sourceNodeRef.current = playAudioBuffer(audioContextRef.current, buffer);
    setIsPlaying(true);

    sourceNodeRef.current.onended = () => {
      setIsPlaying(false);
    };
  };

  const handleStop = () => {
    if (sourceNodeRef.current) {
      sourceNodeRef.current.stop();
      setIsPlaying(false);
    }
  };

  return (
    <div className="p-4 border rounded shadow-sm">
      <h2 className="text-lg font-semibold mb-2">Audio Player</h2>
      <button 
        onClick={isPlaying ? handleStop : handlePlay}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        {isPlaying ? 'Stop' : 'Play'}
      </button>
    </div>
  );
};

export default TestAudioPlayer;