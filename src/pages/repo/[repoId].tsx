import Loading from '@/components/loading';
import Modal from '@/components/modals';
import NewTasksDropdown from '@/components/NewButton';
import Toasts from '@/components/toasts';
import { formatStatus } from '@/utils/functions';
import { trpc } from '@/utils/trpc';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { Assignments, Type } from '@prisma/client';
import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { AiFillCaretUp } from 'react-icons/ai';
import { BiTask } from 'react-icons/bi';
import { FaGithub, FaTasks } from 'react-icons/fa';
import { FiChevronDown } from 'react-icons/fi';
import { MdDeleteForever } from 'react-icons/md';

const RepoTodos: React.FC = () => {
  const client = trpc.useContext();
  const [focused, setFocused] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);
  const [showModal, setShowModal] = useState(false);
  const [confirmInput, setConfirmInput] = useState('');
  const router = useRouter();
  const [parent] = useAutoAnimate<HTMLDivElement>();
  const [filter, setFilter] = useState('');
  const { repoId } = router.query;

  const { mutate: deleteProject } = trpc.useMutation(['project.delete'], {
    onSuccess: (data) => {
      client.invalidateQueries(['project.get-all']);
      client.invalidateQueries(['project.get']);
      Toasts.success({
        title: 'Project deleted',
        body: `Project ${data.name} successfully deleted.`,
      });
      setShowModal(false);
      router.push('/');
    },
    onError: (err) => {
      Toasts.error({
        title: 'Failed to delete project',
        body: err.message,
      });
    },
  });

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
  useEffect(() => {
    const bodyClick = (e: MouseEvent) => {
      if (ref.current?.contains(e.target as Node)) {
        return;
      }

      setFocused(false);
    };
    document.addEventListener('click', bodyClick);
    return () => {
      document.removeEventListener('click', bodyClick);
    };
  });

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
    <>
      <div>
        <div className='flex flex-col gap-2 w-full h-full'>
          <div className='justify-between flex'>
            <h1 className='text-2xl font-bold flex items-center '>
              <button
                ref={ref}
                className='flex items-end justify-center text-center relative self-center'
                onClick={(e) => {
                  e.preventDefault();
                  setFocused(!focused);
                }}
              >
                <span className=''>{project.name}</span>
                <FiChevronDown className='' />
                <div
                  className={classNames(
                    focused ? 'visible' : 'hidden',
                    'mt-1 text-base'
                  )}
                >
                  <div
                    className={classNames(
                      `absolute shadow z-10 max-h-48 w-fit mt-1 bg-slate-900 p-1 `,
                      ` top-100  right-0 rounded overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600`
                    )}
                  >
                    <div className='flex flex-col w-full rounded bg-slate-700 '>
                      <div className='w-full rounded cursor-pointer '>
                        <div className={`border-b border-slate-800 w-full`}>
                          <div
                            className={`hover:bg-red-500 select-none flex items-center gap-1 group hover:text-slate-900 px-1 py-1`}
                            onClick={(e) => {
                              e.preventDefault();

                              setFocused(false);
                              setShowModal(true);
                              console.log('Settings !');
                            }}
                          >
                            <MdDeleteForever className='group-hover:animate-wiggle' />
                            Delete
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
              <Link href={`https://github.com/${project.name}`} passHref>
                <a
                  className='p-1 mx-2 bg-slate-900 h-fit flex rounded hover:bg-opacity-60'
                  target='_blank'
                >
                  <FaGithub className='h-fit' />
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
                              splitStatusColor(assignment.statusColor)
                                .variant >= 500
                                ? `text-${
                                    splitStatusColor(assignment.statusColor)
                                      .color
                                  }-200`
                                : `text-${
                                    splitStatusColor(assignment.statusColor)
                                      .color
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
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <div className='flex flex-col max-w-sm h-full'>
          <h2 className='text-xl font-medium text-center'>Delete Project</h2>
          <div className='w-full border-t-[1px] border-solid mt-2 border-slate-800'></div>
          <div className='p-2 flex flex-col'>
            <span className='text-ellipsis'>
              This action cannot be undone. This will permanetly delete{' '}
              <span className='font-semibold italic select-none'>
                {project.name}
              </span>
              . All tasks and todos and will be lost forever.
            </span>
            <label className='py-2'>
              Please type{' '}
              <span className='font-bold italic select-none'>
                {project.name}
              </span>{' '}
              to confirm
            </label>
            <input
              value={confirmInput}
              className='p-1 text-sm bg-transparent rounded outline-1 outline-red-500 outline'
              onChange={(e) => {
                e.preventDefault();
                setConfirmInput(e.target.value);
              }}
            />
          </div>
          <div className='w-full border-t-[1px] border-solid mt-2 border-slate-800'></div>
          <div className='p-2 flex'>
            <button
              onClick={(e) => {
                e.preventDefault();
                if (confirmInput !== project.name) {
                  return;
                }
                deleteProject({
                  id: project.id,
                });
              }}
              disabled={confirmInput !== project.name}
              className='rounded outline-red-500 outline outline-1 hover:bg-red-500 hover:text-slate-900 disabled:outline-red-500/50 disabled:bg-transparent disabled:cursor-not-allowed disabled:text-red-500/50 p-1 w-full h-full'
            >
              I understand the consequences of this action
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default RepoTodos;

