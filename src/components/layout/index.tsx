import Head from 'next/head';
import Image from 'next/image';
import React, { PropsWithChildren, useRef } from 'react';
import { Toaster } from 'react-hot-toast';
import Navbar from './navbar';

const Layout = ({ children }: PropsWithChildren<{}>) => {
  const parent = useRef(null);
  return (
    <>
      <div className='sm:h-auto md:h-screen w-full flex flex-col'>
        <div className='fixed h-full -z-20 bg-slate-800 w-full ' />
        <div
          className={`fixed inset-0 h-full w-full -z-10 bg-[url(/img/grid.svg)] bg-center [mask-image:radial-gradient(rgba(241,245,249,0.1),rgba(148,163,184,1));]`}
        />
        <Navbar />

        <div className='container mx-auto h-full w-full'>
          <div className='p-4 w-full h-full'>{children}</div>
          <Toaster />
        </div>
      </div>
    </>
  );
};

export default Layout;

// background-color: rgb(30, 41, 59);
// background-image: radial-gradient(at 53% 36%, rgb(51, 65, 85) 0, transparent 62%), radial-gradient(at 58% 2%, rgb(100, 116, 139) 0, transparent 52%), radial-gradient(at 29% 86%, rgb(148, 163, 184) 0, transparent 59%), radial-gradient(at 94% 18%, rgb(17, 24, 39) 0, transparent 100%);

