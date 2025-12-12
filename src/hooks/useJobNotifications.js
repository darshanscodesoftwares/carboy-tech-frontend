import { useState, useEffect, useCallback, useRef } from 'react';
import { getJobs } from '../api/jobs';

const useJobNotifications = (enabled = false) => {
  const [showNotification, setShowNotification] = useState(false);
  const lastJobCountRef = useRef(null);
  const isInitialMount = useRef(true);

  const checkForNewJobs = useCallback(async () => {
    if (!enabled) return;

    try {
      const jobs = await getJobs();
      const pendingJobs = jobs.filter(j => j.status === 'pending');
      const currentCount = pendingJobs.length;

      // Only show notification if:
      // 1. Not the initial mount
      // 2. We have a previous count
      // 3. Current count is greater than previous count
      if (!isInitialMount.current && lastJobCountRef.current !== null && currentCount > lastJobCountRef.current) {
        setShowNotification(true);
      }

      lastJobCountRef.current = currentCount;
      isInitialMount.current = false;
    } catch (error) {
      console.error('Failed to check for new jobs:', error);
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled) {
      // Reset state when disabled
      lastJobCountRef.current = null;
      isInitialMount.current = true;
      setShowNotification(false);
      return;
    }

    // Initial check
    checkForNewJobs();

    // Poll every 30 seconds
    const interval = setInterval(checkForNewJobs, 30000);

    return () => {
      clearInterval(interval);
    };
  }, [enabled, checkForNewJobs]);

  const dismissNotification = useCallback(() => {
    setShowNotification(false);
  }, []);

  return {
    showNotification,
    dismissNotification,
  };
};

export default useJobNotifications;
