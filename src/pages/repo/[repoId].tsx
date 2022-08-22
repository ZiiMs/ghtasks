import NewTasksDropdown from '@/components/NewButton';
import Toasts from '@/components/toasts';
import { trpc } from '@/utils/trpc';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

const RepoTodos: React.FC = () => {
  const client = trpc.useContext();
  const router = useRouter();
  const [filter, setFilter] = useState('');
  const { repoId } = router.query;

  const { data: project, isLoading } = trpc.useQuery(
    [
      'project.get',
      {
        repoId: Number.parseInt(repoId as string),
      },
    ],
    {
      onSuccess: (data) => {
        console.log(data);
      },
      onError: (error) => {
        console.log(error);
        Toasts.error({
          body: error.message,
        });
      },
    }
  );

  if (isLoading || !project) return <div>Loading...</div>;
  const { data: assignemnts } = trpc.useQuery([
    'assignments.get-all',
    {
      projectId: project.id,
    },
  ]);

  return (
    <div className='flex flex-col gap-2 w-full h-full'>
      <div className='justify-between flex'>
        <h1 className='text-2xl font-bold'>{project.name}</h1>
        <div className='select-none rounded-md self-center justify-center flex flex-row disabled:bg-opacity-25 disabled:cursor-not-allowed disabled:text-red-500/25 '>
          <button
            className={`px-2 py-1 hover:cursor-pointer border-r-[1px] border-red-500 bg-slate-900 hover:bg-opacity-60 rounded-l-md ${
              filter !== '' && 'bg-red-500 text-slate-900'
            } font-medium`}
          >
            Filter
          </button>
          <button className='px-2 py-1 bg-slate-900 hover:cursor-pointer hover:bg-opacity-60 border-r-[1px] border-red-500 focus:bg-red-500 focus:text-slate-900 font-medium '>
            Tasks
          </button>
          <button className='px-2 py-1 bg-slate-900 hover:cursor-pointer hover:bg-opacity-60 rounded-r-md focus:bg-red-500 focus:text-slate-900 font-medium'>
            Todos
          </button>
        </div>
        <div>
          <NewTasksDropdown id={project.id} />
        </div>
      </div>
      <div className='grid grid-cols-3 grid-rows-2 items-center justify-center gap-2 h-full'>
        {assignemnts?.map((assignment) => (
          <div key={assignment.id} className='col-auto w-full h-full flex p-1'>
            <div className='flex flex-1 flex-col bg-slate-900 outline p-2 outline-slate-600 text-slate-300 outline-2 rounded-md hover:bg-black hover:bg-opacity-60 hover:cursor-pointer'>
              <div>{assignment.name}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RepoTodos;

