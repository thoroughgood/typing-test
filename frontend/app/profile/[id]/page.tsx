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

  const [testsRes, statsRes] = await Promise.all([
    fetch(
      `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/users/${id}/typing-tests`,
    ),
    fetch(
      `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/stats/${id}`,
    ),
  ]);

  const testResponse = await testsRes.json();
  const typingTests = testResponse.typingTests;
  const userStats = await statsRes.json();
  //fetch user data
  return (
    <div className="flex flex-col items-center  min-h-screen">
      {/* Hero Section */}
      <div className="flex bg-neutral-800 h-64 rounded-md max-w-7xl w-11/12 p-8 m-8 justify-between flex-row font-[family-name:var(--font-geist-mono)]">
        <div className="font-bold text-white text-5xl mx-4">
          {' '}
          {userStats.username}
        </div>
        <div className="flex flex-row gap-16 text-3xl">
          <div className="flex gap-8">
            <div className="font-bold text-white flex-col">
              ACC
              <div className="flex justify-center">
                {Math.round(userStats.averageAccuracy)}
              </div>
            </div>

            <div className="font-bold text-white">
              {' '}
              AVG WPM{' '}
              <div className="flex justify-center">
                {Math.round(userStats.averageWpm)}
              </div>
            </div>

            <div className="font-bold text-white">
              {' '}
              TOP WPM{' '}
              <div className="flex justify-center">
                {userStats.topWpm}
              </div>
            </div>

            <div className="font-bold text-white">
              {' '}
              TESTS TAKEN{' '}
              <div className="flex justify-center">
                {userStats.totalTests}
              </div>{' '}
            </div>
          </div>
        </div>
      </div>
      <div className="font-bold text-white text-2xl">
        Typing Tests
      </div>
      <div className="flex flex-col bg-neutral-800 h-max rounded-md max-w-7xl w-11/12 m-8 text-white">
        <div className="pl-4 gap-4">ID WPM ACC DATE</div>
        {typingTests.map(
          (test: {
            id: string | number;
            wpm: number;
            acc: number;
            createdAt: string;
          }) => (
            <div
              className={`flex flex-row gap-4 rounded-md pl-4 ${Number(test.id) / 2 == 1 ? 'bg-neutral-800' : 'bg-neutral-600'}`}
              key={String(id)}
            >
              <div className="">{test.id}</div>
              <div className="">{test.wpm}</div>
              <div className="">{test.acc}</div>
              <div className="">{test.createdAt}</div>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
