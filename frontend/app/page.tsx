'use client';
import Image from 'next/image';
import bg1 from '../public/dark-background-with-dynamic-shapes_23-2148865192.jpg';
import {
  useEffect,
  useState,
  useRef,
  MouseEvent,
  useCallback,
} from 'react';
import TypeList from '@/components/TypeList';
import Stats from '@/components/Stats';
import { useUser } from '@auth0/nextjs-auth0';
import { useTypingTest } from './hooks/useTypingTest';
import { useCurrentUser } from './hooks/useCurrentUser';

interface dbUser {
  id: number;
  username: string;
  email: string;
  auth0Id: string;
}

//something i learned
//the useUser() method implicitly authenticates the user directly via Auth0, no need for JWT

export default function Home() {
  /* typing test hooks */

  /* Stats */

  const [focus, setFocus] = useState<boolean>(true);
  /* Typing test settings */
  const [timeLimit, setTimeLimit] = useState<number>(0);
  const [wordLimit, setWordLimit] = useState<number>(50);
  const inputRef = useRef<HTMLInputElement>(null);
  const syncedUserRef = useRef<string | null>(null);
  const { user } = useUser();
  const [dbUser, setDbUser] = useState<dbUser | null>(null);
  const [needsUsername, setNeedsUsername] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  //Typing Test Hooks
  const {
    typingTest,
    inputValue,
    currentIndex,
    time,
    correct,
    testFinished,
    wpm,
    acc,
    handleInputChange,
    handleSpacePress,
    startTest,
    resetTest,
  } = useTypingTest(wordLimit, timeLimit, dbUser?.id || 0);

  console.log(dbUser);
  //User Sync Hook
  const { userSync } = useCurrentUser(user);
  function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  useEffect(() => {
    const auth0UserId = user?.sub;

    if (!auth0UserId) {
      syncedUserRef.current = null;
      setNeedsUsername(false);
      return;
    }

    if (syncedUserRef.current === auth0UserId) {
      return;
    }

    syncedUserRef.current = auth0UserId;

    async function sync() {
      try {
        const data = await userSync();
        //let data go to database
        console.log('SYNC RESPONSE BEFORE USERNAME CALL', data);

        if (data?.needsUsername) {
          setNeedsUsername(true);
          return;
        }

        setDbUser(data.user);
      } catch (error) {
        console.error('Failed to sync user', error);
      }
    }

    sync();
  }, [user?.sub, userSync]);

  async function handleUsernameSubmit() {
    const trimmedUsername = usernameInput.trim();

    if (!trimmedUsername || !user?.sub) {
      return;
    }

    try {
      const data = await userSync(trimmedUsername);
      await sleep(2000);

      if (data?.needsUsername) {
        setNeedsUsername(true);
        return;
      }

      setNeedsUsername(false);
      setDbUser(data.user);
    } catch (error) {
      console.error('Failed to create user with username', error);
    }
  }

  function handleOnClick(event: MouseEvent<HTMLButtonElement>) {
    const value = Number((event.target as HTMLButtonElement).value);
    startTest();
    if ([10, 25, 50].includes(value)) {
      setWordLimit(value);
      setTimeLimit(0); // Reset time limit if setting word limit
    } else if ([15, 30, 60].includes(value)) {
      setTimeLimit(value);
      setWordLimit(0); // Reset word limit if setting time limit
    }
  }

  if (needsUsername) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-6 text-white">
        <div className="w-full max-w-md rounded-md border border-zinc-700 bg-zinc-900 p-6 shadow-lg">
          <h2 className="mb-3 text-2xl font-bold text-yellow-200">
            Choose a username
          </h2>
          <p className="mb-6 text-sm text-zinc-400">
            This will be displayed on your profile and leaderboard.
          </p>

          <input
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
            placeholder="Enter username"
            className="w-full rounded-md border border-zinc-600 bg-zinc-800 px-3 py-2 text-white outline-none focus:border-yellow-200"
          />

          <button
            type="button"
            onClick={handleUsernameSubmit}
            disabled={!usernameInput.trim()}
            className="mt-4 w-full rounded-md bg-yellow-200 px-4 py-2 font-bold text-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] text-white">
      <Image
        alt="newspaper textured background"
        src={bg1.src}
        className=" absolute inset-0 h-full w-full object-cover -z-10 object-center opacity-[10%]"
        width="1920"
        height="1080"
      ></Image>
      <main className="flex flex-col gap-8 row-start-2 items-start">
        <div className="flex flex-col gap-2 self-center">
          <div
            id="test-settings"
            className="flex flex-row gap-8 self-center"
          >
            <div
              className={
                wordLimit
                  ? 'text-yellow-200 drop-shadow-[0_0_10px_rgba(255,255,255,1)]'
                  : ''
              }
            >
              no. words
            </div>
            {[10, 25, 50].map((num) => (
              <button
                key={num}
                value={num}
                onClick={handleOnClick}
                className={
                  wordLimit === num
                    ? 'text-yellow-200 drop-shadow-[0_0_10px_rgba(255,255,255,1)]'
                    : ''
                }
              >
                {num}
              </button>
            ))}
          </div>
          <div className="flex flex-row gap-8 self-center">
            <div
              className={
                timeLimit > 0
                  ? 'text-yellow-200 drop-shadow-[0_0_10px_rgba(255,255,255,1)]'
                  : ''
              }
            >
              time limit
            </div>
            {[15, 30, 60].map((num) => (
              <button
                key={num}
                value={num}
                onClick={handleOnClick}
                className={
                  timeLimit === num
                    ? 'text-yellow-200 drop-shadow-[0_0_10px_rgba(255,255,255,1)]'
                    : ''
                }
              >
                {num}
              </button>
            ))}
          </div>
        </div>
        <div
          id="Heading"
          className="font-[family-name:var(--font-geist-mono)] self-center"
        >
          Typing Test - test your typing speed!
        </div>
        <div className="flex flex-col gap-2">
          <Stats stats={{ wpm, acc, time }}></Stats>
          <TypeList
            typeTest={typingTest}
            currentIndex={currentIndex}
            focus={focus}
          />
        </div>
        <div className="justify-center self-center">
          <input
            ref={inputRef}
            value={inputValue}
            className={`text-white border-4 w-2/3 focus:outline-none bg-zinc-700 rounded-sm items-center p-1 ${
              correct ? 'border-green-300' : 'border-red-300'
            } ${inputValue === '' ? 'border-yellow-100' : ''}`}
            onChange={handleInputChange}
            autoFocus
            onFocus={() => {
              setFocus(true);
            }}
            onBlur={() => {
              setFocus(false);
            }}
            onKeyDown={(e) => {
              if (e.key === ' ') {
                handleSpacePress(e);
              }
            }}
            disabled={testFinished}
          />
          <button
            className="border-zinc-700 border-2 p-1 ml-4 rounded-md bg-zinc-800"
            type="submit"
            onClick={() => {
              resetTest();
              inputRef.current?.focus();
            }}
          >
            {testFinished ? 'restart' : 'start'}
          </button>
        </div>

        {testFinished && (
          <div className="self-center mt-4 p-4 bg-zinc-800 border-2 border-yellow-200 rounded-md">
            <h2 className="text-xl mb-2 text-yellow-200">
              Test Complete!
            </h2>
            <p>Final WPM: {wpm}</p>
            <p>Accuracy: {acc}%</p>
            <p>Words completed: {currentIndex}</p>
            <p>Time: {time} seconds</p>
          </div>
        )}
      </main>
    </div>
  );
}
