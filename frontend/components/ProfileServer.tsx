'use client';
import { useUser } from '@auth0/nextjs-auth0';
import Image from 'next/image';
import defaultImage from '@/public/dark-background-with-dynamic-shapes_23-2148865192.jpg';

export default function Profile() {
  const { user, isLoading } = useUser();
  return (
    <>
      {isLoading && <p>Loading...</p>}
      {user && (
        <div style={{ textAlign: 'center' }}>
          <Image
            src={String(user.picture) || defaultImage}
            alt="Profile"
            width="80"
            height="80"
          />
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          <pre>{JSON.stringify(user, null, 2)}</pre>
        </div>
      )}
    </>
  );
}
