"use client";
import { signIn } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { FaGithub } from "react-icons/fa";


const HomePageNoSession = () => {
  return (
    <div className="flex flex-col gap-4">
      <button
        type="button"
        onClick={() => {
          console.log("Tester");
          signIn("github");
        }}
        className="flex flex-row items-center gap-1 rounded-md bg-white px-2 py-1 font-semibold text-gray-900 hover:bg-gray-100 active:scale-95 active:bg-gray-100"
      >
        <FaGithub />
        Sign in with Github
      </button>
    </div>
  );
};

const HomePage = () => {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-bold text-3xl">No Projects Found</h1>
      <Link href={"/repo/new"} passHref className="flex">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
          }}
          className="group relative flex items-center justify-center gap-1 rounded-md bg-slate-900 p-2 hover:bg-opacity-60 focus:ring-2 focus:ring-red-500">
          <span className="absolute h-full w-full animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite] rounded-md bg-transparent outline outline-red-500 outline-solid" />
          <AiOutlinePlus className="text-opacity-100 group-hover:animate-wiggle" />
          Create new project
        </button>
      </Link>
    </div>
  );
};

export { HomePage, HomePageNoSession };
