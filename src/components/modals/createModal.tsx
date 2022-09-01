import { formatStatus } from '@/utils/functions';
import { trpc } from '@/utils/trpc';
import { Status, Type } from '@prisma/client';
import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { AiFillCaretDown, AiFillCaretUp } from 'react-icons/ai';
import { FaGithub } from 'react-icons/fa';
import { z } from 'zod';
import Modal from '.';
import Toasts from '../toasts';

type Modal = { isOpen: boolean; onClose: () => void; id: number; type: Type };

const CreateModal: React.FC<Modal> = ({ isOpen, onClose, id, type }) => {
  const AssignmentSchema = z.object({
    name: z.string().min(1),
    description: z.string(),
    status: z.nativeEnum(Status),
    statusColor: z.object({
      color: z.string(),
      variant: z.number(),
    }),
  });
  type Assignment = z.infer<typeof AssignmentSchema>;
  const [form, setForm] = useState<Assignment>({
    name: '',
    description: '',
    status: 'OPEN',
    statusColor: {
      color: '',
      variant: 800,
    },
  });
  const [showColors, setShowColors] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

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
      setForm({
        name: '',
        description: '',
        status: 'OPEN',
        statusColor: {
          color: '',
          variant: 800,
        },
      });
      onClose();
    },
    onError: (err) => {
      console.log(err);
    },
  });

  useEffect(() => {
    const bodyClick = (e: MouseEvent) => {
      if (
        ref.current?.contains(e.target as Node) ||
        buttonRef.current?.contains(e.target as Node)
      ) {
        console.log('Clicked', buttonRef.current);
        return;
      }
      setShowColors(false);
    };
    document.addEventListener('click', bodyClick);
    return () => {
      document.removeEventListener('click', bodyClick);
    };
  }, [showColors]);



  const colors = [
    'stone',
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

  const getStatusKeys = () => {
    return Object.keys(Status) as Array<keyof typeof Status>;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className='flex flex-col w-full h-full'>
        <h1 className='text-xl font-bold text-center'>
          {type === Type.TASK ? 'Task ' : 'Todo '}Modal
        </h1>
        <div className='w-full border-t-[1px] border-solid mt-2 border-slate-800'></div>
        <div className='flex flex-row'>
          <div className='flex flex-col  p-2'>
            <label>Name</label>
            <input
              value={form.name}
              onChange={(e) => {
                e.preventDefault();
                setForm({ ...form, name: e.target.value });
              }}
              className='p-1 text-sm bg-transparent rounded outline-1 outline-red-500 outline'
            />
          </div>
          <div className='flex flex-col p-2'>
            <label>Desciption</label>
            <input
              value={form.description}
              onChange={(e) => {
                e.preventDefault();
                setForm({ ...form, description: e.target.value });
              }}
              className='p-1 text-sm bg-transparent rounded outline-1 outline-red-500 outline'
            />
          </div>
        </div>
        <div className='flex relative flex-row'>
          <div className='flex flex-col p-2'>
            <label>Status</label>
            <select
              value={form.status}
              onChange={(e) => {
                e.preventDefault();
                console.log(e.target.value);
                setForm({
                  ...form,
                  status: Status[e.target.value as keyof typeof Status],
                });
              }}
              className='p-1 text-sm bg-transparent rounded outline-1 border-slate-700 outline-red-500 outline'
            >
              {getStatusKeys().map((key) => (
                <option className='bg-slate-900 ' key={key} value={Status[key]}>
                  {formatStatus(Status[key])}
                </option>
              ))}
            </select>
          </div>

          <div className='flex flex-col items-end justify-end w-full p-2'>
            <button
              ref={buttonRef}
              className={classNames(
                'px-2 py-1 rounded w-full hover:bg-opacity-60',
                form.statusColor.color !== ''
                  ? `bg-${form.statusColor.color}-${form.statusColor.variant}`
                  : 'bg-slate-800',
                form.statusColor.variant <= 500
                  ? 'text-slate-800'
                  : 'text-slate-300'
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
              const error = AssignmentSchema.safeParse(form);
              if (!error.success) {
                Toasts.error({
                  title: 'Error creating assignment',
                  body: `Error: ${error.error.issues[0]?.message} at ${error.error.issues[0]?.path[0]} `,
                });
                console.log(error.error.message);
                return;
              }
              const { description, name, status, statusColor } = form;
              console.log(
                description,
                name,
                status,
                `${statusColor.color}-${statusColor.variant}`,
                type,
                id
              );
              mutate({
                description,
                name,
                status,
                statusColor: `${statusColor.color}-${statusColor.variant}`,
                type: type,
                projectId: id,
              });
            }}
          >
            Create
          </button>
        </div>
      </div>
      {showColors}
      <div className={classNames(showColors ? 'visible' : 'hidden', '')}>
        <div
          className={classNames(
            `absolute shadow z-10 w-full bg-slate-900 p-2  mx-2 outline-2 outline-slate-700/75 outline-solid outline`,
            `items-center top-0 left-full justify-center flex-shrink-0 rounded`
          )}
          ref={ref}
        >
          <div className='grid grid-cols-8 w-full '>
            {colors.map((color, d) => (
              <div key={d} className='flex flex-col mx-auto gap-y-2'>
                {variants.map((variant, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setForm({
                        ...form,
                        statusColor: {
                          color,
                          variant,
                        },
                      });
                      setShowColors(false);
                    }}
                    className={classNames(
                      'w-[1.5rem] h-[1.5rem] rounded-full cursor-pointer outline-2 outline-solid outline-black/75 outline',
                      `hover:outline-${color}-${variant}/50`,
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

export default CreateModal;

