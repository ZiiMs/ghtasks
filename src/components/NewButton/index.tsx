import { Type } from '@prisma/client';
import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { AiFillCaretDown, AiFillCaretUp } from 'react-icons/ai';
import { BiTask } from 'react-icons/bi';
import { FaTasks } from 'react-icons/fa';
import CreateModal from '../modals/createModal';

const NewNotesDropdown: React.FC<{ id: number }> = ({ id }) => {
  const [focused, setFocused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [showModal, setShowModal] = useState(false);
  const [type, setType] = useState<Type>(Type.NOTE);

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
  return (
    <>
      <CreateModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        id={id}
        type={type}
      />

      <div className='relative' ref={ref}>
        <button
          className={classNames(
            'bg-slate-900  p-2 rounded-md hover:bg-opacity-60 flex flex-row',
            'disabled:bg-opacity-25 disabled:cursor-not-allowed disabled:text-red-500/25',
            'focus:ring-2 focus:ring-red-500'
          )}
          // disabled={isFetching}
          onClick={(e) => {
            e.preventDefault();
            setFocused(!focused);

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
          <span
            className={classNames('flex items-center justify-center gap-2')}
          >
            New
            <AiFillCaretDown
              className={classNames(focused ? 'hidden' : 'visible')}
            />
            <AiFillCaretUp
              className={classNames(focused ? 'visible' : 'hidden')}
            />
          </span>
        </button>
        <div className={classNames(focused ? 'visible' : 'hidden', 'mt-1 absolute ')}>
          <AiFillCaretUp
            className={classNames(
              'absolute  z-20 left-12 top-[-0.35rem] text-slate-900'
            )}
          />
          <div
            className={classNames(
              `absolute shadow z-10 max-h-48 w-fit mt-1 bg-slate-900 p-1`,
              `rounded overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600`
            )}
          >
            <div className='flex flex-col w-full rounded bg-slate-700'>
              <div className='w-full rounded cursor-pointer'>
                <div className={`border-b border-slate-800 w-full`}>
                  <div
                    className={`hover:bg-red-500 select-none flex items-center gap-1 group hover:text-slate-900 px-1 py-1`}
                    onClick={(e) => {
                      e.preventDefault();

                      setFocused(false);
                      setType(Type.NOTE);
                      setShowModal(true);

                      console.log('Settings !');
                    }}
                  >
                    <BiTask className='group-hover:animate-wiggle' />
                    Notes
                  </div>
                </div>
              </div>
              <div className='w-full rounded cursor-pointer'>
                <div className={`border-b border-slate-800 w-full`}>
                  <div
                    className={`hover:bg-red-500 select-none flex items-center gap-1 group hover:text-slate-900 px-1 py-1`}
                    onClick={(e) => {
                      e.preventDefault();

                      setFocused(false);
                      setType(Type.TODO);
                      setShowModal(true);
                      console.log('Settings !');
                    }}
                  >
                    <FaTasks className='group-hover:animate-wiggle' />
                    Todos
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewNotesDropdown;

