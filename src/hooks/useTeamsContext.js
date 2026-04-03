/**
 * useTeamsContext Hook
 * 
 * Custom React hook for Teams SDK integration
 * Provides Teams context and user information to components
 * 
 * Features:
 *   - Lazy initialization of Teams SDK
 *   - Context caching to avoid repeated calls
 *   - Error handling and graceful degradation
 *   - Automatic cleanup on unmount
 * 
 * Usage:
 *   const { isTeamsApp, user, theme, loading, error } = useTeamsContext()
 */

import { useEffect, useState, useCallback } from 'react';
import { teamsService } from '../services/teamsService';

// Module-level cache to share context across components
let cachedContext = null;
let cachePromise = null;

export function useTeamsContext() {
  const [context, setContext] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function initializeContext() {
      try {
        // If already cached, use cached value
        if (cachedContext) {
          if (isMounted) {
            setContext(cachedContext);
            setLoading(false);
          }
          return;
        }

        // If another request is in flight, wait for it
        if (cachePromise) {
          const result = await cachePromise;
          if (isMounted) {
            setContext(result);
            setLoading(false);
          }
          return;
        }

        // Create new initialization promise
        cachePromise = (async () => {
          await teamsService.initialize();
          const ctx = await teamsService.getContext();
          cachedContext = ctx;
          return ctx;
        })();

        const result = await cachePromise;
        cachePromise = null;

        if (isMounted) {
          setContext(result);
          setError(null);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
          setLoading(false);
        }
      }
    }

    initializeContext();

    // Cleanup
    return () => {
      isMounted = false;
    };
  }, []);

  // Function to refresh context
  const refresh = useCallback(async () => {
    setLoading(true);
    cachedContext = null;
    try {
      const ctx = await teamsService.getContext();
      setContext(ctx);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    ...context,
    loading,
    error,
    refresh,
  };
}

export default useTeamsContext;
