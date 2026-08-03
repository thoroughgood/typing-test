import { auth0 } from '@/lib/auth0';
import { GetServerSideProps } from 'next';

export default function ProtectedPage({ user }: { user: any }) {
  //fetch user data from database, also need to fetch user stats and typing tests
  fetch(
    `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/users/[:id]`,
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
  return (
    <div>
      <h1>Protected Content</h1>
      <p>Welcome!</p>
    </div>
  );
}
