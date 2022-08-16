import Head from 'next/head';
import React, { PropsWithChildren, useRef } from 'react';
import { Toaster } from 'react-hot-toast';
import Navbar from './navbar';

const Layout = ({ children }: PropsWithChildren<{}>) => {
  const parent = useRef(null)
  return (
    <div className='min-h-screen h-screen min-w-screen w-screen flex flex-col'>
      <div ref={parent} className='flex flex-col h-full'>
        <Navbar />
        <div className='h-full flex flex-col w-full p-4'>{children}</div>
        <Toaster />
      </div>
    </div>
  );
};

export default Layout;

