import { auth0 } from '@/lib/auth0';
import { GetServerSideProps } from 'next';

export default function ProtectedPage({ user }: { user: any }) {
  return (
    <div>
      <h1>Protected Content</h1>
      <p>Welcome, {user.name}!</p>
    </div>
  );
}
