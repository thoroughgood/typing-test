'use client';
import { useCurrentUser } from '@/app/hooks/useCurrentUser';
import { useUser } from '@auth0/nextjs-auth0';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface DbUser {
  id: number;
  username: string;
  email: string;
  auth0Id: string;
}

export default function Navbar() {
  const { user } = useUser();
  const [dbUser, setDbUser] = useState<DbUser | null>(null);

  const { userSync } = useCurrentUser(user);

  useEffect(() => {
    if (!user) {
      setDbUser(null);
      return;
    }

    async function sync() {
      try {
        const data = await userSync();
        setDbUser(data.user);
      } catch (error) {
        console.error('Failed to sync user:', error);
      }
    }

    sync();
  }, [user, userSync]);

  return (
    <header className="w-full px-8 pt-6">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between rounded-md bg-zinc-800 px-6 shadow-md">
        {/* Logo */}
        <Link
          href="/"
          className="font-[family-name:var(--font-geist-mono)] text-xl font-bold tracking-wide text-white transition hover:text-yellow-200"
        >
          THOROUGHTYPE
        </Link>
        {/* Account */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {dbUser && (
                <Link
                  href={`/profile/${dbUser.id}`}
                  className="hidden text-sm text-zinc-400 transition hover:text-yellow-200 sm:block"
                >
                  {dbUser.username}
                </Link>
              )}

              <a
                href="/auth/logout"
                className="rounded-md border border-zinc-600 px-4 py-2 text-sm font-bold text-white transition hover:border-yellow-200 hover:text-yellow-200"
              >
                Logout
              </a>
            </>
          ) : (
            <a
              href="/auth/login"
              className="rounded-md border border-yellow-200 px-4 py-2 text-sm font-bold text-yellow-200 transition hover:bg-yellow-200 hover:text-zinc-900"
            >
              Login
            </a>
          )}
        </div>
      </nav>
    </header>
  );
}
