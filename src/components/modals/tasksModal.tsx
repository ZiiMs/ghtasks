import { trpc } from '@/utils/trpc';
import { Type } from '@prisma/client';
import React, { useState } from 'react';
import Modal from '.';
import Toasts from '../toasts';

type Modal = { isOpen: boolean; onClose: () => void; id: number };

const TasksModal: React.FC<Modal> = ({ isOpen, onClose, id }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');
  const [color, setColor] = useState('');
  const [type, setType] = useState<Type>(Type.TASK);

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

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className='flex flex-col w-full h-full'>
        <h1 className='text-xl font-bold text-center'>Tasks Modal</h1>
        <div className='w-full border-t-[1px] border-solid mt-2 border-slate-800'></div>
        <div className='flex flex-row'>
          <div className='flex flex-col p-2'>
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
        <div className='flex flex-row'>
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
          <div className='flex flex-col p-2'>
            <label>StatusColor</label>
            <input
              value={color}
              onChange={(e) => {
                e.preventDefault();
                setColor(e.target.value);
              }}
              className='p-1 text-sm bg-transparent rounded outline-1 outline-red-500 outline'
            />
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
                statusColor: color,
                type: Type.TODO,
                projectId: id,
              });
            }}
          >
            Create
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default TasksModal;

