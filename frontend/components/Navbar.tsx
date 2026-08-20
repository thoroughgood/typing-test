'use client';
import { useCurrentUser } from '@/app/hooks/useCurrentUser';
import { useUser } from '@auth0/nextjs-auth0';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import ProfileServer from './ProfileServer';
interface dbUser {
  id: number;
  username: string;
  email: string;
  auth0Id: string;
}

export default function Navbar() {
  const [hidden, setHidden] = useState<boolean>(true);
  const { user, isLoading } = useUser();
  const [dbUser, setDbUser] = useState<dbUser | null>(null);
  function onClick() {
    setHidden(true);
  }
  const { userSync } = useCurrentUser(user);
  useEffect(() => {
    console.log('user state changed');
    if (!user) return;
    console.log('user exists, syncing with database');
    async function sync() {
      const data = await userSync();
      console.log('sync response', data);
      setDbUser(data.user);
    }
    sync();
  }, [user]);

  return (
    <>
      <div className="bg-zinc-800 h-24 shadow-md rounded-sm flex flex-row items-center justify-center gap-8 w-full">
        {user && (
          <>
            <nav className="justify-evenly items-center">
              <Link
                className="bg-zinc-300 rounded-md p-4 font-bold h-12"
                href="/auth/logout"
                prefetch={true}
                onClick={onClick}
              >
                <button>Logout</button>
              </Link>
            </nav>
          </>
        )}
        {!user && (
          <>
            <nav className="flex flex-row items-center justify-evenly align-middle w-full">
              <button className="">
                <Link
                  className="bg-zinc-300 rounded-md p-4 font-bold h-12"
                  href="/auth/login"
                  prefetch={true}
                >
                  Login
                </Link>
              </button>
            </nav>
          </>
        )}
        {/* profile server waits for dbUser to become a valid object */}
        <button className="bg-zinc-300 rounded-md p-4 h-12">
          <Link href="/"> Home </Link>
        </button>
        <code id="Title" className="text-white">
          THOROUGHTYPE
        </code>{' '}
        {dbUser && <ProfileServer dbUser={dbUser}></ProfileServer>}
      </div>
    </>
  );
}
