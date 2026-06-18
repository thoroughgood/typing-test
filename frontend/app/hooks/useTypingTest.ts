import { useEffect, useMemo, useState } from 'react';
import words from '@/public/words.json';

export function useTypingTest(wordLimit: number, timeLimit: number) {
  const [typingTest, setTypingTest] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const [time, setTime] = useState(0);
  const [totalChar, setTotalChar] = useState(0);
  const [correctChar, setCorrectChar] = useState(0);
  const [correct, setCorrect] = useState(true);

  //useMemo caches result unless calculation changes
  const testFinished =
    (wordLimit > 0 && currentIndex >= wordLimit) ||
    (timeLimit > 0 && time >= timeLimit);

  const wpm =
    time > 0 ? Number(((totalChar / 5 / time) * 60).toFixed(1)) : 0;

  const acc =
    totalChar > 0
      ? Number(((correctChar / totalChar) * 100).toFixed(2))
      : 0;

  // ─────────────────────────────
  // Timer effect
  // ─────────────────────────────
  useEffect(() => {
    if (!isRunning || testFinished) return;

    const interval = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, testFinished]);

  // Stop test automatically
  useEffect(() => {
    if (testFinished) {
      setIsRunning(false);
    }
  }, [testFinished]);

  function initializeTest() {
    //shuffle words
    const shuffled = [...words].sort(() => Math.random() - 0.5);

    const limit = wordLimit > 0 ? wordLimit : 200;

    setTypingTest(shuffled.slice(0, limit));

    setCurrentIndex(0);
    setInputValue('');
    setTime(0);
    setTotalChar(0);
    setCorrectChar(0);
    setCorrect(true);
    setIsRunning(false);
  }

  function startTest() {
    setIsRunning(true);
  }

  function resetTest() {
    initializeTest();
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (testFinished) return;

    if (!isRunning) setIsRunning(true);

    const value = e.target.value;
    setInputValue(value);

    const currentWord = typingTest[currentIndex];

    if (currentWord?.slice(0, value.length) === value) {
      setCorrect(true);
      setCorrectChar((prev) => prev + 1);
    } else {
      setCorrect(false);
    }

    setTotalChar((prev) => prev + 1);
  }

  function speltCorrectly() {
    return inputValue === typingTest[currentIndex];
  }

  function handleSpacePress(
    e: React.KeyboardEvent<HTMLInputElement>,
  ) {
    if (e.key !== ' ') return;

    e.preventDefault();

    if (speltCorrectly()) {
      setCurrentIndex((prev) => prev + 1);
      setCorrectChar(correctChar + 1);
      setInputValue('');
    }

    setTotalChar((prev) => prev + 1);
  }

  useEffect(() => {
    initializeTest();
  }, [wordLimit, timeLimit]);

  console.log(correctChar, totalChar);

  return {
    // states
    typingTest,
    inputValue,
    currentIndex,
    time,
    isRunning,
    correct,

    // calculations
    testFinished,
    wpm,
    acc,

    // actions
    handleInputChange,
    handleSpacePress,
    startTest,
    resetTest,
  };
}
