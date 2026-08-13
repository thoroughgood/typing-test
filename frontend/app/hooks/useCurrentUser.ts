import { useUser } from '@auth0/nextjs-auth0';
//Identify if the user is already in the database
export function useCurrentUser(user: any) {
  async function userSync() {
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
    const data = await res.json();
    return data;
  }

  return { userSync };
}
