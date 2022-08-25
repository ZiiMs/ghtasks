import NewTasksDropdown from '@/components/NewButton';
import Toasts from '@/components/toasts';
import { trpc } from '@/utils/trpc';
import { Assignments } from '@prisma/client';
import classNames from 'classnames';
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
        router.push('/');
      },
    }
  );

  const splitStatusColor = (statusColor: string) => {
    const split = statusColor.split('-');
    if (split.length === 2) {
      return { color: split[0], variant: Number.parseInt(split[1] ?? 100) };
    }
    return { color: 'stone', variant: 100 };
  };

  const getBorderColor = (assignment: Assignments) => {
    return `border-${assignment.statusColor}`;
  };

  const { data: assignemnts } = trpc.useQuery([
    'assignments.get-all',
    {
      projectId: project?.id ?? -1,
    },
  ]);
  if (isLoading || !project)
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
    <div>
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
        <div className='flex flex-col items-start justify-start h-full'>
          {assignemnts?.map((assignment) => (
            <div
              key={assignment.id}
              className={classNames('w-full h-full p-1')}
            >
              <div
                className={classNames(
                  ` border-l-4 ${getBorderColor(assignment)} `,
                  'flex flex-col bg-slate-900 outline p-2 outline-slate-800 text-slate-300 outline-1 shadow-lg rounded-md hover:bg-black hover:bg-opacity-60 hover:cursor-pointer'
                )}
              >
                <div className='flex items-start justify-between w-full'>
                  <div>
                    <div>{assignment.name}</div>
                    <div>{assignment.description}</div>
                  </div>
                  <div className='flex flex-col items-end'>
                    <div
                      className={classNames(
                        `rounded-md w-fit bg-${assignment.statusColor} font-bold px-2`,
                        splitStatusColor(assignment.statusColor).variant >= 500
                          ? `text-${splitStatusColor(assignment.statusColor).color}-200`
                          : `text-${splitStatusColor(assignment.statusColor).color}-900`
                      )}
                    >
                      {assignment.status}
                    </div>
                    <div>{assignment.updatedAt.toLocaleDateString()}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RepoTodos;

