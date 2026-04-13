import { Skeleton } from '@/components/ui/skeleton';

interface typeTestInterface {
  typeTest: string[];
  currentIndex: number;
  focus: boolean;
}

export default function typingTest({
  typeTest,
  currentIndex,
  focus,
}: typeTestInterface) {
  return (
    <>
      <div className="flex flex-row flex-wrap gap-1 bg-zinc-800 p-8 rounded shadow-inner shadow-zinc-900 border-4 border-zinc-700 self-center lg:w-2/3">
        {typeTest.length != 1 ? (
          typeTest.map((word, index) => (
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
    </>
  );
}
