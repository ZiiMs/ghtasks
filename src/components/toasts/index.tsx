import { CSSProperties } from 'react';
import { toast, ToastPosition } from 'react-hot-toast';
import { BiErrorCircle } from 'react-icons/bi';

type ToastType = {
  id?: string | undefined;
  position?: ToastPosition | undefined;
  style?: CSSProperties | undefined;
  title?: string | undefined;
  body: string;
};

const Toasts: {
  error: (toast: ToastType) => void;
} = {
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
                    {title}
                  </span>
                </div>
                <span className='font-normal text-white '>{body}</span>
              </div>
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
};

export default Toasts;

