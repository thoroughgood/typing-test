import { useCallback } from 'react';

export function useCurrentUser(user: any) {
  const userSync = useCallback(async () => {
    if (!user) return null;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/users/sync`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: user.name,
          email: user.email,
          auth0Id: user.sub,
        }),
      },
    );

    if (!res.ok) {
      throw new Error('Failed to sync user');
    }

    return res.json();
  }, [user]);

  return { userSync };
}
