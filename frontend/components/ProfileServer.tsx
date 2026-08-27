'use client';
import { useUser } from '@auth0/nextjs-auth0';
import Image from 'next/image';
import defaultImage from '@/public/dark-background-with-dynamic-shapes_23-2148865192.jpg';
import Link from 'next/link';
interface userProps {
  id: number;
}
export default function Profile(dbUser: userProps) {
  const { user, isLoading } = useUser();
  console.log(dbUser);

  if (isLoading || !dbUser) {
    return <p>Loading...</p>;
  }
  return (
    <>
      {isLoading && <p>Loading...</p>}
      {user && (
        <div style={{ textAlign: 'center' }}>
          <Link href={`/profile/${dbUser.id}`}>
            <Image
              className="rounded-xl border-2 border-black"
              src={String(user.picture) || defaultImage}
              alt="Profile"
              width="80"
              height="80"
            />
          </Link>
        </div>
      )}
    </>
  );
}
