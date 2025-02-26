'use client';
import Image from 'next/image';
import words from '../public/words.json';
import { useEffect, useState } from 'react';

export default function Home() {
  const [TypingTest, setTypingTest] = useState<Array<string>>(['']); // Typing test pool
  const [currentIndex, setCurrentIndex] = useState<number>(0); // What word the user is on
  const [inputValue, setInputValue] = useState(''); //reads what the user has typed

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

  const sameWord = () => {
    if (inputValue == TypingTest[currentIndex]) {
      setCurrentIndex(currentIndex + 1);
      return true;
    } else return false;
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  /* create a react hook that manages the state of the input */
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="font-[family-name:var(--font-geist-mono)]"></div>
        {TypingTest.join(' ')}
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          {/* update input value when spacebar is clicked */}
          <input
            className="text-black"
            onChange={handleInputChange}
            onKeyDown={(keyDown) => {
              if (keyDown.key == ' '){
                if (sameWord() == true) {
                  
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
