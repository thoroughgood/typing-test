import { useEffect, useState } from 'react';

export function useProfile(userId: string) {
  const [userTypingTests, setUserTypingTests] = useState<any[]>([]);
  const [userStats, setUserStats] = useState<any>(null);
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
