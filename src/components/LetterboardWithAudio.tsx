'use client';

import React, { useEffect } from 'react';
import { WithAudioPlayback } from './WithAudioPlayback';
import { Letterboard } from './letterboard';
import ClientAnalyticsWrapper from './ClientAnalyticsWrapper';
import { useSession } from 'next-auth/react';
import analytics from '@/lib/analytics';

interface LetterboardWithAudioProps {
  userSettings: any; // Replace 'any' with a proper type for your user settings
}

const LetterboardWithAudio: React.FC<LetterboardWithAudioProps> = ({ userSettings }) => {
  const { data: session } = useSession();

  useEffect(() => {
    const boardUsageStart = new Date();
    
    return () => {
      if (session?.user?.id) {
        const boardUsageEnd = new Date();
        analytics.trackBoardUsage('letterboard', boardUsageStart, boardUsageEnd);
      }
    };
  }, [session?.user?.id]);

  return (
    <ClientAnalyticsWrapper userId={session?.user?.id}>
      <WithAudioPlayback>
        <Letterboard userSettings={userSettings} />
      </WithAudioPlayback>
    </ClientAnalyticsWrapper>
  );
};

export default LetterboardWithAudio;
