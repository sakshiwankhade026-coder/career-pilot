import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSocket } from './useSocket';

/**
 * Custom hook to track user presence status safely with optimized event cleanup
 * @param {string[]} userIds - Array of user IDs to track
 */
export function usePresence(userIds = []) {
  const { onlineUsers, subscribe } = useSocket();
  const [presenceMap, setPresenceMap] = useState({});

  // Serialize to a collision-safe JSON string so that user IDs containing
  // commas (or any delimiter) are encoded correctly. Sorting first ensures
  // ['a','b'] and ['b','a'] produce the same key and don't trigger extra
  // subscriptions due to order differences.
  const serializedUserIds = useMemo(
    () => JSON.stringify([...userIds].sort()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [userIds.length, ...userIds]
  );

  // Reconstruct a stable array reference by parsing the JSON string so that
  // inline arrays (e.g. usePresence(['user1','user2'])) do not cause the
  // subscription effects below to re-run on every parent render.
  const stableUserIds = useMemo(
    () => JSON.parse(serializedUserIds),
    [serializedUserIds]
  );

  // 1. Synchronize local map when global onlineUsers change or target user IDs change
  useEffect(() => {
    const map = {};
    stableUserIds.forEach(uid => {
      const user = onlineUsers.find(u => u.uid === uid);
      map[uid] = {
        isOnline: !!user,
        status: user?.status || 'offline',
        lastSeen: user?.lastSeen || null
      };
    });
    setPresenceMap(map);
  }, [stableUserIds, onlineUsers]);

  // 2. Subscribe to real-time status changes with a stabilized dependency array
  useEffect(() => {
    // If no target users are provided, skip setting up socket listeners entirely
    if (stableUserIds.length === 0) return;

    const unsubOnline = subscribe('user_online', ({ uid }) => {
      if (stableUserIds.includes(uid)) {
        setPresenceMap(prev => ({
          ...prev,
          [uid]: { isOnline: true, status: 'online', lastSeen: new Date() }
        }));
      }
    });

    const unsubOffline = subscribe('user_offline', ({ uid }) => {
      if (stableUserIds.includes(uid)) {
        setPresenceMap(prev => ({
          ...prev,
          [uid]: { isOnline: false, status: 'offline', lastSeen: new Date() }
        }));
      }
    });

    const unsubStatusChange = subscribe('user_status_changed', ({ uid, status }) => {
      if (stableUserIds.includes(uid)) {
        setPresenceMap(prev => ({
          ...prev,
          [uid]: { ...prev[uid], status, lastSeen: new Date() }
        }));
      }
    });

    // CRITICAL CLEANUP: Ensures old subscriptions are cleanly unwound 
    // before re-executing or upon hook unmount.
    return () => {
      unsubOnline();
      unsubOffline();
      unsubStatusChange();
    };
  }, [stableUserIds, subscribe]);

  // 3. Wrap helper utility methods in useCallback to prevent parent re-renders
  const isUserOnline = useCallback((uid) => {
    return presenceMap[uid]?.isOnline || false;
  }, [presenceMap]);

  const getUserStatus = useCallback((uid) => {
    return presenceMap[uid]?.status || 'offline';
  }, [presenceMap]);

  return {
    presenceMap,
    isUserOnline,
    getUserStatus,
    onlineCount: onlineUsers.length
  };
}

export default usePresence;