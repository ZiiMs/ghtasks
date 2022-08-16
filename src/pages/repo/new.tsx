import { trpc } from '@/utils/trpc';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import {
  AiOutlineArrowLeft,
  AiOutlineCaretDown,
  AiOutlinePlus,
  AiOutlineSearch
} from 'react-icons/ai';
import { BiErrorCircle } from 'react-icons/bi';
import { FaGithub } from 'react-icons/fa';

const NewProject: React.FC = () => {
  const router = useRouter();
  const { data, isLoading } = trpc.useQuery(['repo.get'], {
    onSuccess: (data) => {
      console.log(data.filter((repo) => repo.description !== null));
      if (data && data[0]) {
        setRepos(data);
      } else {
        setRepos([]);
        setError('No repos found');
      }
    },
  });

  const { mutate } = trpc.useMutation(['repo.create'], {
    onSuccess: (data) => {
      console.log('SuccessMutation', data);
      router.push('/repo/' + data.id);
    },
    onError: (error) => {
      console.log('ErrorMutation', error.message);
      setStage(0);
      setError(error.message);
    },
  });

  const [search, setSearch] = useState('');
  const [repos, setRepos] = useState(data ?? []);
  // const [focused, setFocused] = useState(false);
  const [selected, setSelected] = useState<number>(0);
  const [error, setError] = useState('');
  const [stage, setStage] = useState<number>(0);
  const ref = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   const bodyClick = (e: MouseEvent) => {
  //     if (ref.current?.contains(e.target as Node)) {
  //       return;
  //     }

  //     setFocused(false);
  //   };
  //   document.addEventListener('click', bodyClick);
  //   return () => {
  //     document.removeEventListener('click', bodyClick);
  //   };
  // });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    const filteredData = data?.filter((d) =>
      d.full_name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setRepos(filteredData ?? []);
  };

  return (
    <div className='flex justify-center items-center h-full mx-auto'>
      <div className='flex flex-col '>
        <div className='bg-slate-900 p-3 rounded-lg'>
          {stage === 0 && (
            <div
              className='items-center justify-center py-1 group flex flex-grow'
              ref={ref}
            >
              <input
                disabled={isLoading || error !== ''}
                onChange={(e) => {
                  e.preventDefault();

                  handleSearch(e);
                }}
                onClick={(e) => {
                  e.preventDefault();
                }}
                value={search}
                placeholder={'Search for a repo'}
                className={`bg-transparent placeholder:opacity-50 placeholder:text-red-400 disabled:outline-none disabled:placeholder:opacity-20 disabled:bg-slate-800 resize-none row-span-1 placeholder:text-opacity-40 rounded-l-md outline outline-1 group-focus-within:outline-2 group-hover:outline-red-600 outline-red-500 px-2 py-1`}
              />

              <button
                disabled={isLoading}
                className={`outline rounded-r-md disabled:outline-none disabled:placeholder:opacity-20 disabled:bg-slate-800 outline-1   group-focus-within:outline-2 group-hover:outline-red-600  outline-red-500 px-2 py-1 h-8`}
              >
                <AiOutlineSearch className='' />
              </button>
            </div>
          )}

          <div
            className={`shadow z-40 max-h-48 w-full mt-1 bg-slate-700 bg-opacity-60 top-100  left-0 rounded overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 `}
          >
            <div className='flex flex-col w-full'>
              <div className='cursor-pointer w-full rounded'>
                {stage === 0 ? (
                  <>
                    {repos?.map((item, i) => (
                      <div
                        key={item.id}
                        className={`border-b border-slate-800 w-full `}
                      >
                        <div
                          className={`hover:bg-red-500 flex items-center gap-1 group hover:text-slate-900 px-1 py-1 ${
                            i === 0 && 'border-l-4 border-red-500'
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            console.log('Settings !');
                            setSelected(item.id);
                            setRepos(data ?? []);
                            setStage(1);
                          }}
                        >
                          <FaGithub className='group-hover:animate-wiggle' />
                          {item.full_name}
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className={`border-b border-slate-800 w-full `}>
                    <div
                      className={`hover:bg-red-500 flex items-center gap-1 group hover:text-slate-900 px-1 py-1 border-l-4 border-red-500`}
                      onClick={(e) => {
                        e.preventDefault();
                        setStage(0);
                      }}
                    >
                      <AiOutlineArrowLeft className='group-hover:animate-wiggle' />
                      Back
                    </div>
                    <div
                      className={`hover:bg-red-500 flex items-center gap-1 group hover:text-slate-900 px-1 py-1 border-l-4 border-red-500`}
                      onClick={(e) => {
                        e.preventDefault();
                        const item = data?.find((d) => d.id === selected);
                        console.log(item);
                        if (item) {
                          mutate({
                            repoId: selected,
                            name: item.full_name,
                            description: item.description ?? undefined,
                          });
                        } else {
                          setStage(0);
                        }
                        console.log('create new project');
                      }}
                    >
                      <AiOutlinePlus className='group-hover:animate-wiggle' />
                      Create Project
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {error !== '' && (
          <div className='bg-[#E03131] bg-opacity-20 mt-2 py-3 px-4  rounded  divide-rose-600'>
            <div className='flex '>
              <div className='items-center content-center justify-start w-5 h-5 mr-4'>
                <BiErrorCircle
                  className='leading-none text-red-300'
                  size={'1.25rem'}
                />
              </div>
              <div className='flex flex-col '>
                <div className='box-border flex items-center mb-3 '>
                  <span className='text-lg font-bold leading-none text-red-300'>
                    Error
                  </span>
                </div>
                <span className='font-normal text-white '>{error}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewProject;

