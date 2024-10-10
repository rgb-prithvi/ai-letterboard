'use client';

import React, { useEffect, useCallback } from 'react';
import analytics from '@/lib/analytics';

interface ClientAnalyticsWrapperProps {
  userId: string | undefined;
  children: React.ReactNode;
}

const ClientAnalyticsWrapper: React.FC<ClientAnalyticsWrapperProps> = ({ userId, children }) => {
  const updateLastActive = useCallback(() => {
    if (userId) {
      analytics.updateLastActive();
    }
  }, [userId]);

  useEffect(() => {
    const initAnalytics = async () => {
      if (userId) {
        await analytics.identify(userId);
        await analytics.startSession();
      }
    };

    initAnalytics();

    // Set up activity listeners
    const activityEvents = ['mousedown', 'keydown', 'touchstart', 'scroll'];
    activityEvents.forEach(event => window.addEventListener(event, updateLastActive));

    // Attempt to end session on page unload
    const handleUnload = () => {
      if (userId) {
        analytics.endSession();
      }
    };
    window.addEventListener('beforeunload', handleUnload);

    // Set up periodic updates
    const intervalId = setInterval(updateLastActive, 60000); // Update every minute

    return () => {
      activityEvents.forEach(event => window.removeEventListener(event, updateLastActive));
      window.removeEventListener('beforeunload', handleUnload);
      clearInterval(intervalId);
    };
  }, [userId, updateLastActive]);

  return <>{children}</>;
};

export default ClientAnalyticsWrapper;