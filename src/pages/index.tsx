import type { NextPage } from 'next';
import { getSession, useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';
import { AiOutlineCaretDown, AiOutlineCaretUp } from 'react-icons/ai';
import { trpc } from '../utils/trpc';

type TechnologyCardProps = {
  name: string;
  description: string;
  documentation: string;
};

const Home: NextPage = () => {
  const { status } = useSession();
  const isLoading = status === 'loading';

  const { data: projects } = trpc.useQuery(['repo.get-user'], {
    onSuccess: (data) => {
      console.log(data);
    },
  });

  if (isLoading)
    return (
      <div className=' flex flex-col items-center justify-center gap-2 h-full'>
        <div
          style={{
            borderTopColor: 'transparent',
          }}
          className='w-12 h-12 border-4 items-center justify-center border-red-500 border-solid rounded-full animate-spin'
        />
        <span className='text-2xl '>Loading...</span>
      </div>
    );

  return (
    <div className='grid min-h-0 flex-1 grid-cols-5 gap-2 grid-rows-3 overflow-y-auto'>
      {projects?.map((project) => (
        <div key={project.id} className='col-auto flex p-1 '>
          <div className='flex flex-1 flex-col bg-slate-700 outline p-2 outline-red-500 outline-2 rounded-md'>
            <div>{project.name}</div>
            <div>{project.description}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Home;

