import { Callback } from 'hono/lambda-edge';
import { useEffect } from 'react';

interface statsParams {
  stats: {
    wpm: number;
    acc: number;
    time: number;
  };
}
export default function Stats({ stats }: statsParams) {
  // Calculate accuracy

  return (
    <>
      <div className="flex flex-row justify-around w-2/3 self-center">
        <div className="max-w-32">accuracy {stats.acc}%</div>
        <div className="max-w-32">WPM {stats.wpm} </div>
        <div className="max-w-32">time {stats.time} sec</div>
      </div>
    </>
  );
}
