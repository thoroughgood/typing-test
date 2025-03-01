'use client';
import Image from 'next/image';
import bg from '../public/old-newspaper-background-1600-x-900-6ksb2hasjjob55ug.jpg';
import bg1 from '../public/dark-background-with-dynamic-shapes_23-2148865192.jpg';
import words from '../public/words.json';
import { useEffect, useState } from 'react';

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

  function randomiseWords() {
    return 0.5 - Math.random();
  }

  useEffect(() => {
    if (testStart) {
      setTypingTest(words.sort(randomiseWords));
      setTestStart(false);
      setCurrentIndex(0);
      setTotalChar(0);
      setCorrectChar(0);
      setWpm(0);
      setTime(0);
      setIsRunning(false);
    }
  }, [testStart]);
  //if isRunning is true, interval is equal to setInterval, which is the time + 1 every second, prev = 0 by default
  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => setTime((prev) => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    setAccuracy(Number(((correctChar / totalChar) * 100).toFixed(2)));
  }, [correctChar, totalChar, time]);

  useEffect(() => {
    setWpm(Number(((totalChar / 5 / time) * 60).toFixed(1)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time]);
  const sameWord = () => {
    if (inputValue === typingTest[currentIndex]) {
      setCurrentIndex(currentIndex + 1);
      return true;
    }
    return false;
  };

  const handleInputChange = (event) => {
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

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Image
        alt="newspaper textured background"
        src={bg1.src}
        className=" absolute inset-0 h-full w-full object-cover -z-10 object-center opacity-[10%]"
        width="1920"
        height="1080"
      ></Image>
      <code>THOROUGHTYPE</code>
      <main className="flex flex-col gap-8 row-start-2 items-start">
        <div className="font-[family-name:var(--font-geist-mono)] self-center">
          Typing Test - test your typing speed!
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-row justify-around w-2/3 self-center">
            <div className="max-w-32">accuracy {accuracy}%</div>
            <div className="max-w-32">WPM {wpm} </div>
            <div className="max-w-32">time {time} sec</div>
          </div>
          <div className="flex flex-row flex-wrap gap-1 bg-zinc-800 p-4 rounded shadow-inner shadow-zinc-900 border-4 border-zinc-700 self-center lg:w-2/3">
            {typingTest.map((word, index) => (
              <span
                className={
                  index === currentIndex
                    ? 'bg-yellow-100 text-black rounded-sm px-1'
                    : 'text-white'
                }
                key={word}
              >
                {word}
              </span>
            ))}
          </div>
        </div>
        <div className="justify-center self-center">
          <input
            value={inputValue}
            className={`text-black border-4 focus:outline-none border-blue-200 bg-white rounded-sm items-center ${
              correct ? 'border-green-500' : 'border-red-500'
            } ${inputValue === '' ? 'border-yellow-200' : ''}`}
            onChange={handleInputChange}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === ' ') {
                e.preventDefault();
                if (sameWord()) {
                  setInputValue('');
                }
              }
            }}
          />
          <button
            className="border-zinc-700 border-2 p-1 ml-4 rounded-md bg-zinc-800"
            onClick={() => {
              setTestStart(true);
              setInputValue('');
            }}
          >
            start
          </button>
        </div>
      </main>
    </div>
  );
}
