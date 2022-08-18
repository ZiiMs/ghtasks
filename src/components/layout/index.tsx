import Head from 'next/head';
import Image from 'next/image';
import React, { PropsWithChildren, useRef } from 'react';
import { Toaster } from 'react-hot-toast';
import Navbar from './navbar';

const Layout = ({ children }: PropsWithChildren<{}>) => {
  const parent = useRef(null);
  return (
    <div className='min-h-screen h-screen min-w-screen w-screen overflow-hidden relative flex flex-col'>
      <div ref={parent} className='flex flex-col h-full'>
        <Navbar />
        <div className='absolute h-full bg-slate-800 w-full '/>
        <div className={`absolute inset-0 bg-[url(/img/grid.svg)] bg-center [mask-image:radial-gradient(rgba(241,245,249,0.1),rgba(148,163,184,1));]`}/>
        
        <div className='h-full flex z-10 flex-col w-full p-4'>
          {children}
        </div>
        <Toaster />
      </div>
    </div>
  );
};

export default Layout;

// background-color: rgb(30, 41, 59);
// background-image: radial-gradient(at 53% 36%, rgb(51, 65, 85) 0, transparent 62%), radial-gradient(at 58% 2%, rgb(100, 116, 139) 0, transparent 52%), radial-gradient(at 29% 86%, rgb(148, 163, 184) 0, transparent 59%), radial-gradient(at 94% 18%, rgb(17, 24, 39) 0, transparent 100%);

