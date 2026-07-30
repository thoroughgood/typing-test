import { useUser } from '@auth0/nextjs-auth0';
//Identify if the user is already in the database
export function useCurrentUser(user: any) {
  async function userSync() {
    console.log('inside userSync() in useCurrentUsers.ts');
    const res = await fetch(
      `https://${process.env.APP_BASE_URL}/api/users/sync`,
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
    console.log(res);
  }
  return { userSync };
}
