import { auth0 } from '@/lib/auth0';
import { GetServerSideProps } from 'next';

type Props = {
  user: any;
  params: Promise<{ id: string }>;
};

//import page paramaters from url
export default async function ProtectedPage({ user, params }: Props) {
  //fetch user data from database, also need to fetch user stats and typing tests
  const { id } = await params;
  console.log(id);
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/users/${id}/typing-tests`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  const data = await res.json();
  console.log(data);

  //fetch user data
  return (
    <div className="flex flex-col items-center  min-h-screen">
      {/* Hero Section */}
      <div className="flex bg-neutral-800 h-64 rounded-md max-w-7xl w-11/12 p-8 m-8 justify-between flex-row font-[family-name:var(--font-geist-mono)]">
        <div className="font-bold text-white text-5xl mx-4">
          {' '}
          {data.username}
        </div>
        <div className="flex flex-row gap-8 text-3xl">
          <div className="flex">
            <div className="font-bold text-white flex-col">
              ACC
              <div className=""></div>
            </div>

            <div className="font-bold text-white"> AVG WPM </div>

            <div className="font-bold text-white"> TOP WPM </div>

            <div className="font-bold text-white"> TESTS TAKEN </div>
          </div>
        </div>
      </div>
      <div className="font-bold text-white text-2xl">
        Typing Tests
      </div>
      <div className="flex flex-col bg-neutral-800 h-max rounded-md max-w-7xl w-11/12 m-8 text-white">
        <div className="">TYPING TEST 1</div>
        <div className="">TYPING TEST 1</div>
        <div className="">TYPING TEST 1</div>
      </div>
    </div>
  );
}
