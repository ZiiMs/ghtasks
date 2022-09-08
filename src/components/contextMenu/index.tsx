import classNames from 'classnames';
import React, { ReactNode, useCallback, useEffect, useRef } from 'react';

const ContextMenu: React.FC<{
  showMenu: boolean;
  x: number;
  y: number;
  toggleMenu: () => void;
  children: ReactNode;
}> = ({ showMenu, x, y, children, toggleMenu }) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleClick = useCallback(
    (e: MouseEvent) => {
      if (ref.current?.contains(e.target as Node)) {
        return;
      }
      toggleMenu();
    },
    [toggleMenu]
  );

  const handleContextMenu = useCallback((e: MouseEvent) => {
    console.log('contextMenu clicked', e);
    if (!e.defaultPrevented) {
      toggleMenu();
    }
  }, [toggleMenu]);

  useEffect(() => {
    document.addEventListener('click', handleClick);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  });

  if (!showMenu) return null;

  return (
    <div
      className={classNames(`absolute`)}
      style={{
        top: y + 'px',
        left: x + 'px',
      }}
      onContextMenu={(e) => {
        e.preventDefault();
      }}
    >
      <div
        ref={ref}
        className='bg-slate-800/40 outline-slate-700 outline-1 outline rounded-sm backdrop-blur-sm w-fit h-fit'
      >
        {children}
      </div>
    </div>
  );
};

export default ContextMenu;

