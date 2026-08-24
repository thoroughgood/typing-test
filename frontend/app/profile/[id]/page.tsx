import { useCurrentUser } from '@/app/hooks/useCurrentUser';
import { useUser } from '@auth0/nextjs-auth0';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProtectedPage({ params }: Props) {
  const { id } = await params;

  const [testsRes, statsRes, user] = await Promise.all([
    fetch(
      `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/users/${id}/typing-tests`,
    ),
    fetch(
      `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/stats/${id}`,
    ),
    fetch(
      `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/users/${id}`,
    ),
  ]);

  const testResponse = await testsRes.json();
  const typingTests = testResponse.typingTests;
  const userStats = await statsRes.json();
  const userProfile = await user.json();
  console.log(userProfile);

  return (
    <main className="min-h-screen w-full px-8 pb-20 pt-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-10">
        {/* Profile Header */}
        <section className="rounded-md bg-zinc-800 p-8 shadow-md">
          <div className="flex flex-col justify-center gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 font-bold font-[family-name:var(--font-geist-mono)] text-xl uppercase tracking-widest text-yellow-200">
                {userProfile.username}'s Profile
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section>
          <h2 className="mb-4 font-[family-name:var(--font-geist-mono)] text-lg text-zinc-400">
            Statistics
          </h2>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard
              label="AVG WPM"
              value={Math.round(userStats.averageWpm)}
            />

            <StatCard
              label="AVG ACC"
              value={`${Math.round(userStats.averageAccuracy)}%`}
            />

            <StatCard
              label="TOP WPM"
              value={userStats.topWpm}
              accent
            />

            <StatCard label="TESTS" value={userStats.totalTests} />
          </div>
        </section>

        {/* Typing Tests */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-[family-name:var(--font-geist-mono)] text-lg text-zinc-400">
              Typing Tests
            </h2>

            <span className="font-[family-name:var(--font-geist-mono)] text-sm text-zinc-500">
              {typingTests.length} tests
            </span>
          </div>

          <div className="overflow-hidden rounded-md bg-zinc-800 shadow-md">
            <table className="w-full border-collapse text-left font-[family-name:var(--font-geist-mono)]">
              <thead>
                <tr className="border-b border-zinc-700 text-sm text-zinc-400">
                  <th className="px-6 py-4">TEST</th>
                  <th className="px-6 py-4">WPM</th>
                  <th className="px-6 py-4">ACC</th>
                  <th className="px-6 py-4">DATE</th>
                </tr>
              </thead>

              <tbody>
                {typingTests.map((test) => (
                  <tr
                    key={test.id}
                    className="border-b border-zinc-700 last:border-0 hover:bg-zinc-700/50"
                  >
                    <td className="px-6 py-4 text-zinc-500">
                      #{test.id}
                    </td>

                    <td className="px-6 py-4 font-bold text-white">
                      {test.wpm}
                    </td>

                    <td className="px-6 py-4 text-white">
                      {test.acc}%
                    </td>

                    <td className="px-6 py-4 text-zinc-400">
                      {new Date(test.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {typingTests.length === 0 && (
              <div className="p-10 text-center font-[family-name:var(--font-geist-mono)] text-zinc-500">
                No typing tests yet.
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <div className="rounded-md bg-zinc-800 p-6 shadow-md transition hover:bg-zinc-700">
      <p className="font-[family-name:var(--font-geist-mono)] text-sm text-zinc-500">
        {label}
      </p>

      <p
        className={`mt-2 font-[family-name:var(--font-geist-mono)] text-3xl font-bold ${
          accent ? 'text-yellow-200' : 'text-white'
        }`}
      >
        {value}
      </p>
    </div>
  );
}
