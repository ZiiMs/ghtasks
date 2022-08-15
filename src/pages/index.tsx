import type { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import { AiOutlineCaretDown, AiOutlineCaretUp } from 'react-icons/ai';
import { trpc } from '../utils/trpc';

type TechnologyCardProps = {
  name: string;
  description: string;
  documentation: string;
};

const Home: NextPage = () => {
  const { data, isLoading } = trpc.useQuery(['repo.get', { token: '1234' }], {
    onSettled: (data) => {
      console.log();
    },
  });
  const [search, setSearch] = useState('');
  const [focused, setFocused] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bodyClick = (e: MouseEvent) => {
      if (ref.current?.contains(e.target as Node)) {
        console.log('inside');
        return;
      }
      console.log('erw', e.target, ref.current);

      setFocused(false);
      console.log('outside');
    };
    document.addEventListener('click', bodyClick);
    return () => {
      document.removeEventListener('click', bodyClick);
    };
  });

  return (
    <div>
      <div>Workign!?</div>
      <div className='flex flex-col items-center relative'>
        <div>
          <div
            className='items-center justify-center py-1 group flex flex-grow'
            ref={ref}
          >
            <input
              disabled={isLoading}
              onChange={(e) => {
                e.preventDefault();
              }}
              onClick={(e) => {
                e.preventDefault();
                setFocused(!focused);
              }}
              value={search}
              className={`bg-slate-800 placeholder:text-opacity-40 placeholder:text-white rounded-l-md outline outline-1 group-focus-within:outline-2 group-hover:outline-red-600 outline-red-500 px-2 py-1`}
            />
            <button
              disabled={isLoading}
              onClick={(e) => {
                e.preventDefault();
                console.log(!focused);
                setFocused(!focused);
              }}
              className={`outline rounded-r-md  outline-1 group-focus-within:outline-2 group-hover:outline-red-600  outline-red-500 px-2 py-1 h-8`}
            >
              <AiOutlineCaretDown
                className={`${focused ? 'visible' : 'hidden'}`}
              />
              <AiOutlineCaretUp
                className={`${focused ? 'hidden' : 'visible'}`}
              />
            </button>
          </div>
          <div
            className={`absolute ${
              focused ? 'visible' : 'hidden'
            } shadow z-40 max-h-48 w-full mt-1 bg-slate-700 top-100  left-0 rounded overflow-y-auto scrollbar-thin scrollbar-thumb-slate-900 `}
          >
            <div className='flex flex-col w-full'>
              <div className='cursor-pointer w-full rounded'>
                {data?.map((item, i) => (
                  <div
                    key={item.id}
                    className={`border-b border-slate-800 w-full `}
                  >
                    <div
                      className={`hover:bg-red-500 hover:text-slate-900 px-1 py-1 ${
                        selected === i ? 'border-l-2 border-red-500' : ''
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        console.log('Settings !');
                        setSelected(i);
                        setSearch(item.full_name);
                        setFocused(false);
                      }}
                    >
                      {item.full_name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

