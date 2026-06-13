import { useState, useEffect } from 'react';
import words from '@/public/words.json';

//Current iteration is simply just moving state logic
//just call upon this function and this is functionally the
//same as just sitting in home
export function useTypingTest(wordLimit: number, timeLimit: number) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [correctChar, setCorrectChar] = useState(0);
  const [totalChar, setTotalChar] = useState(0);
  const [acc, setAcc] = useState(0);

  /* In progress stats */
  const [testStart, setTestStart] = useState<boolean>(true);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [wpm, setWpm] = useState(0);

  // Check if the words are the same
  const speltCorrectly = (typingTest: string[]) => {
    if (inputValue === typingTest[currentIndex]) {
      setCurrentIndex(currentIndex + 1);
      return true;
    }
    return false;
  };

  //Restart test
  useEffect(() => {
    if (testStart) {
      const shuffled = [...words].sort(() => Math.random() - 0.5); // Shuffle words
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

  return {
    currentIndex,
    inputValue,
    setCurrentIndex,
    setInputValue,
    speltCorrectly,
  };
}
