import { Type } from '@prisma/client';
import classNames from 'classnames';
import React, { ReactNode, useEffect, useRef } from 'react';
import { AiFillCaretUp } from 'react-icons/ai';
import { BiTask } from 'react-icons/bi';
import { FaTasks } from 'react-icons/fa';

const Dropdown: React.FC<{
  caret: boolean;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}> = ({ caret, open, children, onClose }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bodyClick = (e: MouseEvent) => {
      if (ref.current?.contains(e.target as Node) || !open) {
        return;
      }
      console.log("Closing!?", open)
      onClose();
    };
    document.addEventListener('click', bodyClick);
    return () => {
      document.removeEventListener('click', bodyClick);
    };
  });

  return (
    <div
      ref={ref}
      className={classNames(open ? 'visible' : 'hidden', 'mt-1 absolute')}
    >
      {caret ? (
        <AiFillCaretUp
          className={classNames(
            'absolute  z-20 left-12 top-[-0.35rem] text-slate-900'
          )}
        />
      ) : null}

      <div
        className={classNames(
          `absolute shadow z-10 w-fit mt-1 left-0 top-0 outline-slate-700/50 outline-1 outline bg-slate-900 p-1`,
          `rounded overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600`
        )}
      >
        <div className='flex flex-col w-full'>{children}</div>
      </div>
    </div>
  );
};

Dropdown.defaultProps = {
  caret: false,
};

export default Dropdown;

