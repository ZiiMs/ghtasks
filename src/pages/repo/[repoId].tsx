import Loading from '@/components/loading';
import NewTasksDropdown from '@/components/NewButton';
import Toasts from '@/components/toasts';
import { formatStatus } from '@/utils/functions';
import { trpc } from '@/utils/trpc';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { Assignments } from '@prisma/client';
import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { FaGithub } from 'react-icons/fa';

const RepoTodos: React.FC = () => {
  const client = trpc.useContext();
  const router = useRouter();
  const [parent] = useAutoAnimate<HTMLDivElement>();
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
      return {
        color: split[0],
        variant: split[1] ? Number.parseInt(split[1]) : 100,
      };
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
  if (isLoading || !project) return <Loading />;

  return (
    <div>
      <div className='flex flex-col gap-2 w-full h-full'>
        <div className='justify-between flex'>
          <h1 className='text-2xl font-bold flex items-center justify-center'>
            <span className='items-center justify-center text-center'>
              {project.name}
            </span>
            <Link href={`https://github.com/${project.name}`} passHref>
              <a
                className='p-1 mx-2 bg-slate-900 flex rounded hover:bg-opacity-60'
                target='_blank'
              >
                <FaGithub />
              </a>
            </Link>
          </h1>
          <div className='select-none rounded-md self-center justify-center flex flex-row disabled:bg-opacity-25 disabled:cursor-not-allowed disabled:text-red-500/25 '>
            <button
              className={`px-2 py-1 hover:cursor-pointer border-r-[1px] border-red-500  hover:bg-opacity-60 rounded-l-md ${
                filter !== '' ? 'bg-red-500 text-slate-900' : 'bg-slate-900'
              } font-medium`}
            >
              Filter
            </button>
            <button
              className={classNames(
                'px-2 py-1 hover:cursor-pointer hover:bg-opacity-60 border-r-[1px] border-red-500  font-medium',
                filter === 'todo'
                  ? 'bg-red-500 text-slate-900'
                  : 'text-red-500 bg-slate-900'
              )}
              onClick={(e) => {
                e.preventDefault();
                if (filter === 'todo') {
                  setFilter('');
                } else {
                  setFilter('todo');
                }
              }}
            >
              Tasks
            </button>
            <button
              className={classNames(
                'px-2 py-1 hover:cursor-pointer rounded-r-md hover:bg-opacity-60 font-medium',
                filter === 'task'
                  ? 'bg-red-500 text-slate-900'
                  : 'text-red-500 bg-slate-900'
              )}
              onClick={(e) => {
                e.preventDefault();
                if (filter === 'task') {
                  setFilter('');
                } else {
                  setFilter('task');
                }
              }}
            >
              Todos
            </button>
          </div>
          <div>
            <NewTasksDropdown id={project.id} />
          </div>
        </div>
        <div className='flex flex-col items-start justify-start h-full'>
          {assignemnts?.map((assignment) => (
            <>
              {assignment.type.toLowerCase() === filter ? null : (
                <div
                  key={assignment.id}
                  ref={parent}
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
                            splitStatusColor(assignment.statusColor).variant >=
                              500
                              ? `text-${
                                  splitStatusColor(assignment.statusColor).color
                                }-200`
                              : `text-${
                                  splitStatusColor(assignment.statusColor).color
                                }-900`
                          )}
                        >
                          {formatStatus(assignment.status)}
                        </div>
                        <div>{assignment.updatedAt.toLocaleDateString()}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RepoTodos;

