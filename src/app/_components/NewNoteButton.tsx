"use client";

import { Type } from "@prisma/client";
import classNames from "classnames";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import { BiTask } from "react-icons/bi";
import { FaTasks } from "react-icons/fa";
import CreateModal from "~/app/_components/modals/createNoteModal";

const NewNotesDropdown: React.FC<{ id: number }> = ({ id }) => {
  const [focused, setFocused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [showModal, setShowModal] = useState(false);
  const [type, setType] = useState<Type>(Type.NOTE);

  useEffect(() => {
    const bodyClick = (e: MouseEvent) => {
      if (ref.current?.contains(e.target as Node)) {
        return;
      }

      setFocused(false);
    };
    document.addEventListener("click", bodyClick);
    return () => {
      document.removeEventListener("click", bodyClick);
    };
  });
  return (
    <>
      <CreateModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        id={id}
        type={type}
      />

      <div className="relative" ref={ref}>
        <button
          className={classNames(
            "flex flex-row rounded-md bg-slate-900 p-2 hover:bg-opacity-60",
            "disabled:cursor-not-allowed disabled:bg-opacity-25 disabled:text-red-500/25",
            "focus:ring-2 focus:ring-red-500",
          )}
          // disabled={isFetching}
          onClick={(e) => {
            e.preventDefault();
            setFocused(!focused);

            return;
            // mutate(
            //   {
            //     name: 'New Board',
            //     projectId: data.id,
            //     type: Type.TODOS,
            //   },
            //   {
            //     onSuccess: (data) => {
            //       console.log(data);
            //       client.invalidateQueries([
            //         'project.get',
            //         { repoId: Number.parseInt(repoId as string) },
            //       ]);
            //     },
            //   }
            // );
          }}
        >
          <span
            className={classNames("flex items-center justify-center gap-2")}
          >
            New
            <AiFillCaretDown
              className={classNames(focused ? "hidden" : "visible")}
            />
            <AiFillCaretUp
              className={classNames(focused ? "visible" : "hidden")}
            />
          </span>
        </button>
        <div
          className={classNames(
            focused ? "visible" : "hidden",
            "absolute mt-1 ",
          )}
        >
          <AiFillCaretUp
            className={classNames(
              "absolute top-[-0.35rem] left-12 z-20 text-slate-900",
            )}
          />
          <div
            className={classNames(
              "absolute z-10 mt-1 max-h-48 w-fit bg-slate-900 p-1 shadow",
              "scrollbar-thin scrollbar-thumb-slate-600 overflow-y-auto rounded",
            )}
          >
            <div className="flex w-full flex-col rounded bg-slate-700">
              <div className="w-full cursor-pointer rounded">
                <div className={"w-full border-slate-800 border-b"}>
                  <button
                    className={"group flex select-none items-center gap-1 px-1 py-1 hover:bg-red-500 hover:text-slate-900"}
                    onClick={(e) => {
                      e.preventDefault();

                      setFocused(false);
                      setType(Type.NOTE);
                      setShowModal(true);

                      console.log("Settings !");
                    }}
                  >
                    <BiTask className="group-hover:animate-wiggle" />
                    Notes
                  </button>
                </div>
              </div>
              <div className="w-full cursor-pointer rounded">
                <div className={"w-full border-slate-800 border-b"}>
                  <button
                    className={"group flex select-none items-center gap-1 px-1 py-1 hover:bg-red-500 hover:text-slate-900"}
                    onClick={(e) => {
                      e.preventDefault();

                      setFocused(false);
                      setType(Type.TODO);
                      setShowModal(true);
                      console.log("Settings !");
                    }}
                  >
                    <FaTasks className="group-hover:animate-wiggle" />
                    Todos
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewNotesDropdown;
