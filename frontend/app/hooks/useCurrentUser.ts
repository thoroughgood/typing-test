import { User } from '@auth0/auth0-react';
import { useCallback } from 'react';

export function useCurrentUser(user: User | null | undefined) {
  const userSync = useCallback(
    async (customUsername?: string) => {
      const username =
        customUsername?.trim() ||
        user?.nickname ||
        user?.name ||
        user?.email?.split('@')[0] ||
        '';

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/users/sync`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username,
            email: user?.email,
            auth0Id: user?.sub,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        if (data?.needsUsername) {
          return data;
        }

        throw new Error(data?.error || 'Failed to sync user');
      }

      return data;
    },
    [user?.email, user?.name, user?.nickname, user?.sub],
  );

  return { userSync };
}
