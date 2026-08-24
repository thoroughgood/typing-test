'use client';
import { useEffect, useState } from 'react';

interface typingTestProps {
  id: number;
  userid: number;
  wpm: number;
  acc: number;
  createdAt: string;
}
interface statsProps {
  averageWpm: number;
  averageAcc: number;
  topWpm: number;
  totalTests: number;
}

export function useProfile(userId: string) {
  const [userTypingTests, setUserTypingTests] = useState<
    typingTestProps[]
  >([]);
  const [userStats, setUserStats] = useState<statsProps>(Object);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);

        const [testsRes, statsRes] = await Promise.all([
          fetch(
            `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/users/${userId}/typing-tests`,
          ),
          fetch(
            `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/stats/${userId}/`,
          ),
        ]);

        if (!testsRes.ok || !statsRes.ok) {
          throw new Error('Failed to fetch profile data');
        }

        const tests = await testsRes.json();
        const stats = await statsRes.json();

        setUserTypingTests(tests);
        setUserStats(stats);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Something went wrong',
        );
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  return {
    userTypingTests,
    userStats,
    loading,
    error,
  };
}
