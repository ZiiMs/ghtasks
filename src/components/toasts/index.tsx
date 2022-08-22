import { CSSProperties } from 'react';
import { toast, ToastPosition } from 'react-hot-toast';
import { BiCheckCircle, BiErrorCircle } from 'react-icons/bi';

type ToastType = {
  id?: string | undefined;
  position?: ToastPosition | undefined;
  style?: CSSProperties | undefined;
  title?: string | undefined;
  duration?: number | undefined;
  body: string;
};

const Toasts: {
  errorLarge: (toast: ToastType) => void;
  error: (toast: ToastType) => void;
  success: (toast: ToastType) => void;
} = {
  errorLarge(data: ToastType) {
    toast.custom(
      (t) => (
        <div
          className={`hover:cursor-pointer ${
            t.visible ? 'animate-enter' : 'animate-leave'
          }`}
          onClick={() => toast.dismiss(t.id)}
        >
          <div className='bg-[#452B39] py-3 px-4  rounded  divide-rose-600'>
            <div className='flex'>
              <div className='items-center content-center justify-start w-5 h-5 mr-4'>
                <BiErrorCircle
                  className='leading-none text-red-300'
                  size={'1.25rem'}
                />
              </div>
              <div className='flex flex-col '>
                <div className='box-border flex items-center mb-3 '>
                  <span className='text-lg font-bold leading-none text-red-300'>
                    {data.title}
                  </span>
                </div>
                <span className='font-normal text-white '>{data.body}</span>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        id: data.id,
        position: data.position,
        style: data.style,
        duration: data.duration,
      }
    );
  },
  error({
    id = undefined,
    position = undefined,
    style = undefined,
    title = 'Error',
    body,
  }) {
    toast.custom(
      (t) => (
        <div
          className={`hover:cursor-pointer ${
            t.visible ? 'animate-enter' : 'animate-leave'
          }`}
          onClick={() => toast.dismiss(t.id)}
        >
          <div className='bg-slate-800 border-l-4 border-red-500 outline-1 outline-solid outline outline-slate-900 drop-shadow-lg py-3 px-4 rounded'>
            <div className='flex items-center justify-center gap-2'>
              <BiErrorCircle
                className='leading-none text-red-500'
                size={'1.25rem'}
              />

              <span className='font-normal text-slate-100 '>{body}</span>
            </div>
          </div>
        </div>
      ),
      {
        id,
        position,
        style,
      }
    );
  },
  success(data: ToastType) {
    toast.custom(
      (t) => (
        <div
          className={`hover:cursor-pointer ${
            t.visible ? 'animate-enter' : 'animate-leave'
          }`}
          onClick={() => toast.dismiss(t.id)}
        >
          <div className='bg-slate-800 border-l-4 border-green-600 outline-1 outline-solid outline outline-slate-900 drop-shadow-lg py-3 px-4 rounded'>
            <div className='flex items-center justify-center gap-2'>
              <BiCheckCircle
                className='leading-none text-green-500'
                size={'1.25rem'}
              />

              <span className='font-normal text-slate-100 '>{data.body}</span>
            </div>
          </div>
        </div>
      ),
      {
        id: data.id,
        position: data.position,
        style: data.style,
        duration: data.duration,
      }
    );
  },
};

export default Toasts;

