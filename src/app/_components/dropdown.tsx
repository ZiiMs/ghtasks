"use client";

import classNames from "classnames";
import type React from "react";
import { type ReactNode, useEffect, useRef } from "react";
import { AiFillCaretUp } from "react-icons/ai";

const Dropdown: React.FC<{
  caret: boolean;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}> = ({ caret = false, open, children, onClose }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const bodyClick = (e: MouseEvent) => {
      if (ref.current?.contains(e.target as Node) || !open) {
        return;
      }
      onClose();
    };
    document.addEventListener("click", bodyClick);
    return () => {
      document.removeEventListener("click", bodyClick);
    };
  }, [open, onClose]);

  return (
    <div
      ref={ref}
      className={classNames(open ? "visible" : "hidden", "absolute mt-1")}
    >
      {caret ? (
        <AiFillCaretUp
          className={classNames(
            "absolute top-[-0.35rem] left-12 z-20 text-slate-900",
          )}
        />
      ) : null}

      <div
        className={classNames(
          "absolute top-0 left-0 z-10 mt-1 w-fit bg-slate-900 p-1 shadow outline outline-slate-700/50",
          "scrollbar-thin scrollbar-thumb-slate-600 overflow-y-auto rounded",
        )}
      >
        <div className="flex w-full flex-col">{children}</div>
      </div>
    </div>
  );
};



export default Dropdown;
