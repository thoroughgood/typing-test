import { User } from '@auth0/auth0-react';
import { useCallback } from 'react';

export function useCurrentUser(user: User | null | undefined) {
  const userSync = useCallback(async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/users/sync`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: user?.name,
          email: user?.email,
          auth0Id: user?.sub,
        }),
      },
    );

    if (!res.ok) {
      throw new Error('Failed to sync user');
    }

    const data = await res.json();
    return data;
  }, [user?.name, user?.email, user?.sub]);

  return { userSync };
}
