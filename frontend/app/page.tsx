'use client';
import Image from 'next/image';
import bg1 from '../public/dark-background-with-dynamic-shapes_23-2148865192.jpg';
import words from '../public/words.json';
import { useEffect, useState, useRef, ChangeEvent, MouseEvent } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [typingTest, setTypingTest] = useState<Array<string>>(['']);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [inputValue, setInputValue] = useState<string>('');
  const [correct, setCorrect] = useState<boolean>(true);
  const [totalChar, setTotalChar] = useState(0);
  const [correctChar, setCorrectChar] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [testStart, setTestStart] = useState<boolean>(true);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [focus, setFocus] = useState<boolean>(true);
  const [timeLimit, setTimeLimit] = useState<number>(0);
  const [wordLimit, setWordLimit] = useState<number>(50);
  const [testFinished, setTestFinished] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function shuffleWords() {
    return [...words].sort(() => Math.random() - 0.5);
  }

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

  useEffect(() => {
    console.log(typingTest);
  }, [typingTest]);

  // if isRunning is true, interval is equal to setInterval, which is the time + 1 every second, prev = 0 by default
  useEffect(() => {
    let interval: string | number | NodeJS.Timeout | undefined;
    if (isRunning && !testFinished) {
      interval = setInterval(() => setTime((prev) => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, testFinished]);

  // Calculate accuracy
  useEffect(() => {
    if (totalChar > 0) {
      setAccuracy(
        Number(((correctChar / totalChar) * 100).toFixed(2))
      );
    }
  }, [correctChar, totalChar, time]);

  // Calculate wpm
  useEffect(() => {
    if (time > 0) {
      setWpm(Number(((totalChar / 5 / time) * 60).toFixed(1)));
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

  // Check if the words are the same
  const sameWord = () => {
    if (inputValue === typingTest[currentIndex]) {
      setCurrentIndex(currentIndex + 1);
      return true;
    }
    return false;
  };

  // Typing test logic
  const handleInputChange = (event:ChangeEvent<HTMLInputElement>) => {
    if (testFinished) return;

    if (!isRunning) {
      setIsRunning(true);
    }

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
    console.log(value)
    setTestStart(true);
    if ([10, 25, 50].includes(value)) {
      setWordLimit(value);
      setTimeLimit(0); // Reset time limit if setting word limit
    } else if ([15, 30, 60].includes(value)) {
      setTimeLimit(value);
      setWordLimit(0); // Reset word limit if setting time limit
    }
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
      <code className="text-white">THOROUGHTYPE</code>
      <main className="flex flex-col gap-8 row-start-2 items-start">
        <div className="flex flex-col gap-2 self-center">
          <div className="flex flex-row gap-8 self-center">
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
        <div className="font-[family-name:var(--font-geist-mono)] self-center">
          Typing Test - test your typing speed!
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-row justify-around w-2/3 self-center">
            <div className="max-w-32">accuracy {accuracy}%</div>
            <div className="max-w-32">WPM {wpm} </div>
            <div className="max-w-32">time {time} sec</div>
          </div>
          <div className="flex flex-row flex-wrap gap-1 bg-zinc-800 p-8 rounded shadow-inner shadow-zinc-900 border-4 border-zinc-700 self-center lg:w-2/3">
            {typingTest.length != 1 ? (
              typingTest.map((word, index) => (
                <span
                  className={`${
                    index === currentIndex
                      ? 'bg-yellow-100 text-black text-2xl rounded-sm px-2'
                      : 'text-white text-xl'
                  } ${
                    focus ? 'blur-none' : 'blur-sm'
                  }  ease-in-out duration-200 p-1 leading-5`}
                  key={word}
                >
                  {word}
                </span>
              ))
            ) : (
              <div>
                {' '}
                <Skeleton />
              </div>
            )}
            <div
              className={`${
                focus ? 'hidden' : ''
              } justify-center items-center ease-in-out duration-200`}
            >
              ... click text box to focus
            </div>
          </div>
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
                setTotalChar((prev) => prev + 1)
                e.preventDefault();
                if (sameWord()) {
                  setInputValue('');
                  setCorrectChar((prev) => prev + 1)
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
            <p>Accuracy: {accuracy}%</p>
            <p>Words completed: {currentIndex}</p>
            <p>Time: {time} seconds</p>
          </div>
        )}
      </main>
    </div>
  );
}
