import Toasts from '@/components/toasts';
import { trpc } from '@/utils/trpc';
import { useRouter } from 'next/router';
import React from 'react';

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
      onError: (error) => {
        console.log(error);
        Toasts.error({
          body: error.message,
        });
      },
    }
  );

  // const { mutate, isLoading: isFetching } = trpc.useMutation(
  //   ['board.create'],
  //   {}
  // );

  if (isLoading || !data) return <div>Loading...</div>;

  return (
    <div className='flex flex-col gap-2 w-full h-full'>
      <div className='justify-between flex'>
        <h1 className='text-2xl font-bold'>{data.name}</h1>
        <div className='select-none rounded-md self-center justify-center  flex flex-row  disabled:bg-opacity-25 disabled:cursor-not-allowed disabled:text-red-500/25 '>
          <div className='px-2 py-1 hover:cursor-pointer  border-r-[1px] border-red-500 bg-slate-900 hover:bg-opacity-60 rounded-l-md'>
            Filter
          </div>
          <button className='px-2 py-1 bg-slate-900 hover:cursor-pointer hover:bg-opacity-60 '>
            Tasks
          </button>
          <div className='px-2 py-1 bg-slate-900 hover:cursor-pointer hover:bg-opacity-60 rounded-r-md '>
            Todos
          </div>
        </div>
        <div>
          <button
            className='bg-slate-900 p-2 disabled:bg-opacity-25 disabled:cursor-not-allowed disabled:text-red-500/25 rounded-md hover:bg-opacity-60 focus:ring-2 focus:ring-red-500'
            // disabled={isFetching}
            onClick={(e) => {
              e.preventDefault();
              console.log('max boards || fetching boards');
              Toasts.error({
                body: 'You have reached the maximum amount of boards',
              });
              return;
              // mutate(
              //   {
              //     name: 'New Board',
              //     projectId: data.id,
              //     type: Type.TODOS,
              //   },
              //   {
              //     onSuccess: (data) => {
              //       console.log(data);
              //       client.invalidateQueries([
              //         'project.get',
              //         { repoId: Number.parseInt(repoId as string) },
              //       ]);
              //     },
              //   }
              // );
            }}
          >
            <span>New Board</span>
          </button>
        </div>
      </div>
      <div className='grid grid-cols-3 grid-rows-2 items-center justify-center gap-2 h-full'>
        {/* {data.Board.map((board) => (
          <div key={board.id} className='col-auto w-full h-full flex p-1'>
            <div className='flex flex-1 flex-col bg-slate-900 outline p-2 outline-slate-600 text-slate-300 outline-2 rounded-md hover:bg-black hover:bg-opacity-60 hover:cursor-pointer'>
              <div>{board.name}</div>
            </div>
          </div>
        ))} */}
      </div>
    </div>
  );
};

export default RepoTodos;

