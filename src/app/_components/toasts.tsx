"use client";

import type { CSSProperties } from "react";
import { toast, type ToastPosition } from "react-hot-toast";
import { BiCheckCircle, BiErrorCircle } from "react-icons/bi";

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
        <button
          className={`hover:cursor-pointer ${t.visible ? "animate-enter" : "animate-leave"
            }`}
          onClick={() => toast.dismiss(t.id)}
        >
          <div className="divide-rose-600 rounded bg-[#452B39] px-4 py-3">
            <div className="flex">
              <div className="mr-4 h-5 w-5 content-center items-center justify-start">
                <BiErrorCircle
                  className="text-red-300 leading-none"
                  size={"1.25rem"}
                />
              </div>
              <div className="flex flex-col ">
                <div className="mb-3 box-border flex items-center ">
                  <span className="font-bold text-lg text-red-300 leading-none">
                    {data.title}
                  </span>
                </div>
                <span className="font-normal text-white ">{data.body}</span>
              </div>
            </div>
          </div>
        </button>
      ),
      {
        id: data.id,
        position: data.position,
        style: data.style,
        duration: data.duration,
      },
    );
  },
  error({
    id = undefined,
    position = undefined,
    style = undefined,
    title = "Error",
    body,
  }) {
    toast.custom(
      (t) => (
        <button
          className={`hover:cursor-pointer ${t.visible ? "animate-enter" : "animate-leave"
            }`}
          onClick={() => toast.dismiss(t.id)}
        >
          <div className="rounded border-red-500 border-l-4 bg-slate-800 px-4 py-3 outline outline-slate-900 outline-solid drop-shadow-lg">
            <div className="flex items-center justify-center gap-2">
              <BiErrorCircle
                className="text-red-500 leading-none"
                size={"1.25rem"}
              />

              <span className="font-normal text-slate-100 ">{body}</span>
            </div>
          </div>
        </button>
      ),
      {
        id,
        position,
        style,
      },
    );
  },
  success(data: ToastType) {
    toast.custom(
      (t) => (
        <button
          className={`hover:cursor-pointer ${t.visible ? "animate-enter" : "animate-leave"
            }`}
          onClick={() => toast.dismiss(t.id)}
        >
          <div className="rounded border-green-600 border-l-4 bg-slate-800 px-4 py-3 outline outline-slate-900 outline-solid drop-shadow-lg">
            <div className="flex items-center justify-center gap-2">
              <BiCheckCircle
                className="text-green-500 leading-none"
                size={"1.25rem"}
              />

              <span className="font-normal text-slate-100 ">{data.body}</span>
            </div>
          </div>
        </button>
      ),
      {
        id: data.id,
        position: data.position,
        style: data.style,
        duration: data.duration,
      },
    );
  },
};

export default Toasts;
