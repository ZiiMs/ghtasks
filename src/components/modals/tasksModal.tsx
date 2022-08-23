import { trpc } from '@/utils/trpc';
import { Type } from '@prisma/client';
import classNames from 'classnames';
import React, { useState } from 'react';
import { AiFillCaretDown, AiFillCaretUp } from 'react-icons/ai';
import { FaGithub } from 'react-icons/fa';
import Modal from '.';
import Toasts from '../toasts';

type Modal = { isOpen: boolean; onClose: () => void; id: number };

const TasksModal: React.FC<Modal> = ({ isOpen, onClose, id }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');
  const [color, setColor] = useState({
    color: '',
    variant: 0,
  });
  const [showColors, setShowColors] = useState(false);

  const client = trpc.useContext();
  const { mutate } = trpc.useMutation(['assignments.create'], {
    onSuccess: (data) => {
      console.log(data);
      client.invalidateQueries([
        'assignments.get-all',
        {
          projectId: id,
        },
      ]);
      Toasts.success({
        title: 'Success',
        body: `${data.type.toLocaleLowerCase()} created: ${data.name}`,
      });
      onClose();
    },
  });
  const colors = [
    'slate',
    'red',
    'yellow',
    'green',
    'blue',
    'indigo',
    'purple',
    'pink',
  ];
  const variants = [100, 200, 300, 400, 500, 600, 700, 800, 900];

  const getBgColor = (color: string, variant: number) => {
    return `bg-${color}-${variant}`;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className='flex flex-col w-full h-full'>
        <h1 className='text-xl font-bold text-center'>Tasks Modal</h1>
        <div className='w-full border-t-[1px] border-solid mt-2 border-slate-800'></div>
        <div className='flex flex-row'>
          <div className='flex flex-col  p-2'>
            <label>Name</label>
            <input
              value={name}
              onChange={(e) => {
                e.preventDefault();
                setName(e.target.value);
              }}
              className='p-1 text-sm bg-transparent rounded outline-1 outline-red-500 outline'
            />
          </div>
          <div className='flex flex-col p-2'>
            <label>Desciption</label>
            <input
              value={description}
              onChange={(e) => {
                e.preventDefault();
                setDescription(e.target.value);
              }}
              className='p-1 text-sm bg-transparent rounded outline-1 outline-red-500 outline'
            />
          </div>
        </div>
        <div className='flex relative flex-row'>
          <div className='flex flex-col p-2'>
            <label>Status</label>
            <input
              value={status}
              onChange={(e) => {
                e.preventDefault();
                setStatus(e.target.value);
              }}
              className='p-1 text-sm bg-transparent rounded outline-1 outline-red-500 outline'
            />
          </div>

          <div className='flex flex-col w-full p-2'>
            <label>StatusColor</label>
            <button
              className={classNames(
                'px-2 py-1 rounded w-full h-full hover:bg-opacity-60',
                color.color !== '' ? `bg-${color.color}-${color.variant}` : 'bg-slate-800',
                color.variant >= 500 ? 'text-slate-300' : 'text-slate-800'
              )}
              onClick={() => setShowColors(true)}
            >
              <span
                className={classNames('flex items-center justify-center gap-2')}
              >
                Status Color
              </span>
            </button>
          </div>
        </div>
        <div className='w-full border-t-[1px] border-solid mt-2 border-slate-800'></div>
        <div className='flex items-end justify-between p-2 gap-2'>
          <button
            className='px-2 py-1 rounded hover:bg-slate-700 bg-slate-800'
            onClick={onClose}
          >
            Close
          </button>
          <button
            className='px-2 py-1 hover:bg-slate-700 rounded bg-slate-800'
            onClick={() => {
              mutate({
                description,
                name,
                status,
                statusColor: `${color.color}-${color.variant}`,
                type: Type.TODO,
                projectId: id,
              });
            }}
          >
            Create
          </button>
        </div>
      </div>
      <div className={classNames(showColors ? 'visible' : 'hidden', '')}>
        <div
          className={classNames(
            `absolute shadow z-10 w-full bg-slate-900 p-2  mx-2 outline-2 outline-slate-700/75 outline-solid outline`,
            `items-center top-0 left-full justify-center flex-shrink-0 rounded`
          )}
        >
          <div className='grid grid-cols-8 w-full'>
            {colors.map((color, d) => (
              <div key={d}>
                {variants.map((variant, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setColor({
                        color,
                        variant,
                      });
                      setShowColors(false);
                    }}
                    className={classNames(
                      'w-[1.5rem] h-[1.5rem] rounded-full cursor-pointer hover:outline-2 hover:outline-solid hover:outline-slate-600/75 hover:outline',
                      getBgColor(color, variant)
                    )}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TasksModal;

