'use client';

import React, { useEffect } from 'react';
import { WithAudioPlayback } from './WithAudioPlayback';
import { Letterboard } from './letterboard';
import ClientAnalyticsWrapper from './ClientAnalyticsWrapper';
import { useSession } from 'next-auth/react';
import analytics from '@/lib/analytics';

const LetterboardWithAudio: React.FC = () => {
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
        <Letterboard />
      </WithAudioPlayback>
    </ClientAnalyticsWrapper>
  );
};

export default LetterboardWithAudio;
