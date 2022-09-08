import Loading from '@/components/loading';
import type { NextPage } from 'next';
import { getSession, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import {
  AiOutlineCaretDown,
  AiOutlineCaretUp,
  AiOutlinePlus
} from 'react-icons/ai';
import { trpc } from '../utils/trpc';

type TechnologyCardProps = {
  name: string;
  description: string;
  documentation: string;
};

const Home: NextPage = () => {
  const { status } = useSession();
  const isLoading = status === 'loading';

  const { data: projects } = trpc.useQuery(['project.get-all'], {
    onSuccess: (data) => {
      console.log(data);
    },
  });

  if (isLoading) return <Loading />;

  return (
    <>
      {projects && projects.length > 0 ? (
        <div
          className={` min-h-0 flex-1 w-full h-full grid grid-cols-6 grid-rows-6 gap-2 items-center justify-center`}
        >
          {projects.map((project) => (
            <div
              key={project.id}
              className={`col-auto ${
                projects.length > 6 ? 'row-auto' : 'row-start-3'
              } flex p-1 h-full `}
            >
              <Link passHref href={`/repo/${project.repoId}`}>
                <div className='flex flex-1 flex-col bg-slate-900 overflow-x-hidden overflow-ellipsis outline p-2 outline-red-500/50 outline-2 rounded-md hover:bg-black hover:bg-opacity-60 hover:cursor-pointer'>
                  <div className='self-center font-semibold'>
                    {project.name}
                  </div>
                  <div className='overflow-ellipsis'>{project.description}</div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center gap-2 h-full'>
          No projects found
          <div>
            <Link href={'/repo/new'} passHref className='flex'>
              <button className='bg-slate-900 relative group flex items-center gap-1 p-2 rounded-md justify-center focus:ring-2 focus:ring-red-500 hover:bg-opacity-60'>
                <span className='animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite] absolute h-full w-full rounded-md bg-transparent outline-solid outline outline-red-500'></span>
                <AiOutlinePlus className='group-hover:animate-wiggle text-opacity-100' />{' '}
                Create new project
              </button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;

