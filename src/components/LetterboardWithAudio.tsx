'use client';

import React, { useEffect } from 'react';
import { WithAudioPlayback } from './WithAudioPlayback';
import { Letterboard } from './letterboard';
import { CommunicationBoard } from './communication-board';
import ClientAnalyticsWrapper from './ClientAnalyticsWrapper';
import { useSession } from 'next-auth/react';
import analytics from '@/lib/analytics';
import { UserSettings } from '@/lib/types';

interface LetterboardWithAudioProps {
  userSettings: UserSettings;
}

const LetterboardWithAudio: React.FC<LetterboardWithAudioProps> = ({ userSettings }) => {
  const { data: session } = useSession();

  useEffect(() => {
    const boardUsageStart = new Date();
    
    return () => {
      if (session?.user?.id) {
        const boardUsageEnd = new Date();
        analytics.trackBoardUsage(userSettings.inputMode === 'letter' ? 'letterboard' : 'communication-board', boardUsageStart, boardUsageEnd);
      }
    };
  }, [session?.user?.id, userSettings.inputMode]);

  const BoardComponent = userSettings.inputMode === 'letter' ? Letterboard : CommunicationBoard;

  return (
    <ClientAnalyticsWrapper userId={session?.user?.id}>
      <WithAudioPlayback>
        <BoardComponent userSettings={userSettings} />
      </WithAudioPlayback>
    </ClientAnalyticsWrapper>
  );
};

export default LetterboardWithAudio;
