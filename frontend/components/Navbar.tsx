'use client';
import { useUser } from '@auth0/nextjs-auth0';
import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [hidden, setHidden] = useState<boolean>(true);
  const { user, isLoading } = useUser();
  }
  if (user) {
    const response = await fetch(`https://${process.env.APP_BASE_URL}/api/users/post`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });
    console.log
  }

  const onClick = () => {
    setHidden(!hidden);
  };
  return (
    <>
      {isLoading && <p>Loading..</p>}
      <div className="bg-zinc-800 h-24 shadow-md rounded-sm flex">
        {user && (
          <>
            <Link
              className="bg-zinc-300 rounded-md px-4 font-bold h-12"
              href="/auth/logout"
              prefetch={true}
              onClick={onClick}
            >
              <button>Logout</button>
            </Link>
          </>
        )}
        {!user && (
          <>
            <button>
              <Link
                className="bg-zinc-300 rounded-md p-4 font-bold h-12"
                href="/auth/login"
                prefetch={true}
              >
                Login
              </Link>
            </button>
          </>
        )}
      </div>
    </>
  );
}
