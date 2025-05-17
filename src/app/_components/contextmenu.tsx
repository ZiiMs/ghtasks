"use client";
import classNames from "classnames";
import type React from "react";
import { type ReactNode, useCallback, useEffect, useRef } from "react";

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
    [toggleMenu],
  );

  const handleContextMenu = useCallback(
    (e: MouseEvent) => {
      console.log("contextMenu clicked", e);
      if (!ref.current?.contains(e.target as Node)) {
        toggleMenu();
      }
    },
    [toggleMenu],
  );

  useEffect(() => {
    if (!showMenu) return;
    document.addEventListener("click", handleClick);
    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [showMenu, handleClick, handleContextMenu]);

  if (!showMenu) return null;

  return (
    <div
      className={classNames("absolute")}
      style={{
        top: `${y}px`,
        left: `${x}px`,
      }}
      onContextMenu={(e) => {
        e.preventDefault();
      }}
    >
      <div
        ref={ref}
        className="h-fit w-fit rounded-sm bg-slate-800/40 outline outline-slate-700 backdrop-blur-sm"
      >
        {children}
      </div>
    </div>
  );
};

export default ContextMenu;
