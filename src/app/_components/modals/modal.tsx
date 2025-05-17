"use client";
import classNames from "classnames";
import type React from "react";
import { useEffect } from "react";

interface IModal {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<IModal> = ({ isOpen, onClose, children }) => {

  useEffect(() => {
    console.log("Modal opened", isOpen);
  }, [isOpen]);

  return (
    <div
      className={classNames(
        isOpen ? "block " : "hidden",
        "fixed inset-0 z-40 m-auto flex h-full w-full items-center justify-center ",
      )}
    >
      <button
        className="absolute inset-0 h-full w-full animate-modelBackdrop bg-slate-900 bg-opacity-20 backdrop-blur-sm "
        onClick={onClose}
      />
      <section className="z-50 h-fit min-h-[6rem] w-fit min-w-[12rem] animate-enter rounded-lg bg-slate-900 ring-1 ring-slate-700/30">
        {children}
      </section>
    </div>
  );
};

export default Modal;
