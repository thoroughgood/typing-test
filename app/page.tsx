'use client';
import Image from 'next/image';
import words from '../public/words.json';
import { useEffect, useState } from 'react';

export default function Home() {
  const [TypingTest, setTypingTest] = useState<Array<string>>(['']); // Typing test pool
  const [currentIndex, setCurrentIndex] = useState<number>(0); // What word the user is on
  const [inputValue, setInputValue] = useState<string>(''); //reads what the user has typed
  const [correct, setCorrect] = useState<boolean>(true);
  const [totalChar, setTotalChar] = useState<number>(0);
  const [correctChar, setCorrectChar] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(0);
  const [deletedVal, setDeletedVal] = useState<string>('');
  /* A randomiser function to let us grab a random word from words */
  //try out randomisation after i get it regularly working
  /*
  async function randomiseWords() {
    return await words[Math.floor(Math.random() * 200)];
  }
  useEffect(() => {
    const testArray: string[] = [''];
    for (let i = 0; i++; i < 50) {
      testArray.push(randomiseWords());
    }
    setTypingTest(testArray);
  }, []); */
  useEffect(() => {
    setTypingTest(words);
  }, []);

  useEffect(() => {
    console.log('Updated state', inputValue);
    console.log('Deleted state', deletedVal);
  }, [inputValue, deletedVal]);

  useEffect(() => {
    console.log(correctChar / totalChar);
  }, [correctChar, totalChar]);

  const sameWord = () => {
    if (inputValue == TypingTest[currentIndex]) {
      setCurrentIndex(currentIndex + 1);
      return true;
    } else return false;
  };
  //Whenever the user types, check if the words are currently accurate
  const handleInputChange = (event) => {
    const word = event.target.value;
    setInputValue(word);
    setDeletedVal(inputValue.slice(0, inputValue.length));

    //backspaces do not affect accuracy or total word count
    if (word == deletedVal) {
      return;
    }

    //compare the expected word to the input value, if true, add to correctChar list
    if (
      TypingTest[currentIndex].slice(0, word.length) ===
      event.target.value
    ) {
      setCorrect(true);
      setCorrectChar(correctChar + 1);
    } else {
      setCorrect(false);
    }

    //Add to total characters
    setTotalChar(totalChar + 1);
  };

  /* create a react hook that manages the state of the input */
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <code className="">THOROUGHTYPE</code>
      <main className="flex flex-col gap-8 row-start-2 items-start">
        <div className="font-[family-name:var(--font-geist-mono)] self-center">
          Typing Test - test your typing speed!
        </div>
        <div className="flex flex-row flex-wrap gap-1 bg-zinc-800 p-4 rounded shadow-inner shadow-zinc-900 border-4 border-zinc-700 self-center lg:w-2/3">
          {TypingTest.map((words) => (
            <span
              className={
                words == TypingTest[currentIndex]
                  ? 'bg-yellow-100 text-black rounded-sm px-1'
                  : 'text-white'
              }
              key={words}
            >
              {words}
            </span>
          ))}
        </div>
        <div className="justify-center self-center">
          {/* read input value */}
          <input
            value={inputValue}
            className={`text-black border-4 focus:outline-none border-blue-200 bg-white rounded-sm items-center ${
              correct ? 'border-green-500' : 'border-red-500'
            } ${inputValue == '' ? 'border-yellow-200' : ''}`}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key == ' ') {
                e.preventDefault();
                if (sameWord()) {
                  setInputValue('');
                  setDeletedVal('');
                } else {
                  return false;
                }
              }
            }}
          ></input>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
