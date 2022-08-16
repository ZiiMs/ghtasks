import { trpc } from '@/utils/trpc';
import { Type } from '@prisma/client';
import { useRouter } from 'next/router';
import React from 'react';
import toast from 'react-hot-toast';
import { BiErrorCircle } from 'react-icons/bi';

const RepoTodos: React.FC = () => {
  const client = trpc.useContext();
  const router = useRouter();
  const { repoId } = router.query;

  const { data, isLoading } = trpc.useQuery(
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
    }
  );

  const { mutate, isLoading: isFetching } = trpc.useMutation(
    ['board.create'],
    {}
  );

  if (isLoading || !data) return <div>Loading...</div>;

  return (
    <div className='flex flex-col gap-2 w-full h-full'>
      <div className='justify-between flex'>
        <h1 className='text-2xl font-bold'>{data.name}</h1>
        <div>
          <button
            className='bg-slate-900 p-2 disabled:bg-opacity-25 disabled:cursor-not-allowed disabled:text-red-500/25 rounded-md hover:bg-opacity-60 focus:ring-2 focus:ring-red-500'
            disabled={isFetching}
            onClick={(e) => {
              e.preventDefault();
              if (data.Board.length >= 6) {
                console.log('max boards || fetching boards');
                toast.custom(
                  (t) => (
                    <div
                      className={`hover:cursor-pointer ${
                        t.visible ? 'animate-enter' : 'animate-leave'
                      }`}
                      onClick={() => toast.dismiss(t.id)}
                    >
                      <div className='bg-[#452B39] py-3 px-4  rounded  divide-rose-600'>
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
                            <span className='font-normal text-white '>
                              Max boards reached!
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ),
                  {
                    position: 'top-center',
                    duration: 3000,
                  }
                );
                return;
              }
              mutate(
                {
                  name: 'New Board',
                  projectId: data.id,
                  type: Type.TODOS,
                },
                {
                  onSuccess: (data) => {
                    console.log(data);
                    client.invalidateQueries([
                      'project.get',
                      { repoId: Number.parseInt(repoId as string) },
                    ]);
                  },
                }
              );
            }}
          >
            <span>New Board</span>
          </button>
        </div>
      </div>
      <div className='grid grid-cols-3 grid-rows-2 items-center justify-center gap-2 h-full'>
        {data.Board.map((board) => (
          <div key={board.id} className='col-auto w-full h-full flex p-1'>
            <div className='flex flex-1 flex-col bg-slate-900 outline p-2 outline-slate-600 text-slate-300 outline-2 rounded-md hover:bg-black hover:bg-opacity-60 hover:cursor-pointer'>
              <div>{board.name}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RepoTodos;

