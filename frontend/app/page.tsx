'use client';
import Image from 'next/image';
import bg1 from '../public/dark-background-with-dynamic-shapes_23-2148865192.jpg';
import words from '../public/words.json';
import {
  useEffect,
  useState,
  useRef,
  ChangeEvent,
  MouseEvent,
} from 'react';
import TypeList from '@/components/TypeList';
import Stats from '@/components/Stats';
import ProfileServer from '../components/ProfileServer';
import { useUser } from '@auth0/nextjs-auth0';
import { User } from 'lucide-react';
import { useTypingTest } from './hooks/useTypingTest';

interface data {
  message: String;
}

//something i learned
//the useUser() method implicitly authenticates the user directly via Auth0, no need for JWT

export default function Home() {
  /* typing test hooks */
  const [typingTest, setTypingTest] = useState<Array<string>>(['']);
  /* Stats */
  const [correct, setCorrect] = useState<boolean>(true);
  const [totalChar, setTotalChar] = useState(0);
  const [correctChar, setCorrectChar] = useState(0);
  const [acc, setAcc] = useState(0);
  /* In progress stats */
  const [testStart, setTestStart] = useState<boolean>(true);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [focus, setFocus] = useState<boolean>(true);
  /* Typing test settings */
  const [timeLimit, setTimeLimit] = useState<number>(0);
  const [wordLimit, setWordLimit] = useState<number>(50);
  const [testFinished, setTestFinished] = useState<boolean>(false);
  const [message, setMessage] = useState('loading');
  const [usernamePopUp, setUsernamePopUp] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { user, isLoading } = useUser();
  const [username, setUsername] = useState<String>('');

  {currentIndex, inputValue, setCurrentIndex, setInputValue} = useTypingTest()

  function shuffleWords() {
    return [...words].sort(() => Math.random() - 0.5);
  }
  //userSignIn method flow
  //Function is called when we identify that a user has signed in with OAuth
  //once (user) is true -> they have signed in

  //check database with id extracted from user -> if in database already, load the users information
  //if not in database, we need to add the user to the database
  async function userSignIn() {
    if (user) {
      //get the user from database to prove they're real
      const id = user.sub;

      //TESTING AREA
      const jwt = await fetch(
        `http://${process.env.APP_BASE_URL}/auth/access-token`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        },
      );
      //
      //if response is positive -> load user information etc
      //if response is negative -> sign them in
      const response = await fetch(
        `https://${process.env.APP_BASE_URL}/api/users/${id}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        },
      );
      //if there is no user they sign up and then we add to database with new username
      if (!response) {
        //TODO:
        //Trigger popup for username entry
        setUsernamePopUp(true);
        //Type in username then click continue -> store it in useState
        //Need to return the usernamePopUp as false
        const addUser = await fetch(
          `https://${process.env.APP_BASE_URL}/api/users/`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user, username: username }),
          },
        );
      }
      //if there is no user in database, pass the information into database to register the user on our website
    }
  }

  //this probably will remain inside the parent
  // Hook to reset typing test
  useEffect(() => {
    if (testStart) {
      const shuffled = shuffleWords(); // Shuffle words
      if (wordLimit > 0) {
        setTypingTest(shuffled.slice(0, wordLimit)); // Use selected word limit
      } else if (timeLimit > 0) {
        setTypingTest(shuffled.slice(0, 200)); // Always 200 words for time-based test
      }
      setCurrentIndex(0);
      setTotalChar(0);
      setCorrectChar(0);
      setWpm(0);
      setTime(0);
      setIsRunning(false);
      setTestFinished(false);
      setTimeout(() => setTestStart(false), 0);
    }
  }, [testStart, timeLimit, wordLimit]);
  //this react hook checks if the typing test has finished, and also manages time
  // if isRunning is true, interval is equal to setInterval, which is the time + 1 every second, prev = 0 by default
  useEffect(() => {
    let interval: string | number | NodeJS.Timeout | undefined;
    if (isRunning && !testFinished) {
      interval = setInterval(() => setTime((prev) => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, testFinished]);
  //calculate Accuracy
  useEffect(() => {
    if (totalChar > 0) {
      setAcc(Number(((correctChar / totalChar) * 100).toFixed(2)));
    }
  }, [correctChar, totalChar]);
  // Calculate wpm
  useEffect(() => {
    if (time > 0) {
      const wpm = ((totalChar / 5 / time) * 60).toFixed(1);
      setWpm(Number(wpm));
    }
  }, [time, totalChar]);

  // Check test completion conditions
  useEffect(() => {
    // Check if word limit is reached
    if (wordLimit > 0 && currentIndex >= wordLimit) {
      setTestFinished(true);

      setIsRunning(false);
    }

    // Check if time limit is reached
    if (timeLimit > 0 && time >= timeLimit) {
      setTestFinished(true);
      setIsRunning(false);
    }
  }, [currentIndex, time, wordLimit, timeLimit]);



  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    if (testFinished) return;

    if (!isRunning) {
      setIsRunning(true);
    }
    /* Collect current typed word */
    const word = event.target.value;
    setInputValue(word);
    const delWord = word.slice(0, word.length - 1);
    if (word === delWord) return;

    if (typingTest[currentIndex].slice(0, word.length) === word) {
      setCorrect(true);
      setCorrectChar((prev) => prev + 1);
    } else {
      setCorrect(false);
    }
    setTotalChar((prev) => prev + 1);
  };

  function handleOnClick(event: MouseEvent<HTMLButtonElement>) {
    const value = Number((event.target as HTMLButtonElement).value);
    setTestStart(true);
    if ([10, 25, 50].includes(value)) {
      setWordLimit(value);
      setTimeLimit(0); // Reset time limit if setting word limit
    } else if ([15, 30, 60].includes(value)) {
      setTimeLimit(value);
      setWordLimit(0); // Reset word limit if setting time limit
    }
  }

  /*
  if (testFinished) {
    const testResults = {
      WPM: wpm,
      ACC: acc,
      WORDS: currentIndex,
      TIME: time,
    };
    try {
      const response = await fetch('/api/testResults', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testResults),
      });
    } catch (error) {
      console.log(error);
    }
  }  */

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] text-white">
      <Image
        alt="newspaper textured background"
        src={bg1.src}
        className=" absolute inset-0 h-full w-full object-cover -z-10 object-center opacity-[10%]"
        width="1920"
        height="1080"
      ></Image>
      {/* This is here for me to see the data displayed by user easily */}
      <ProfileServer></ProfileServer>{' '}
      <code id="Title" className="text-white">
        THOROUGHTYPE
      </code>{' '}
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
                setTotalChar((prev) => prev + 1);
                e.preventDefault();
                if (speltCorrectly()) {
                  setInputValue('');
                  setCorrectChar((prev) => prev + 1);
                }
              }
            }}
            disabled={testFinished}
          />
          <button
            className="border-zinc-700 border-2 p-1 ml-4 rounded-md bg-zinc-800"
            type="submit"
            onClick={() => {
              setTestStart(true);
              setInputValue('');
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
