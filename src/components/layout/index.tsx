import Head from 'next/head';
import React, { PropsWithChildren } from 'react';
import Navbar from './navbar';

const Layout = ({ children }: PropsWithChildren<{}>) => {
  return (
    <div className='min-h-screen h-screen min-w-screen w-screen flex flex-col'>
      <div className='flex flex-col h-full'>
        <Navbar />
        <div className='h-full flex flex-col w-full p-4'>{children}</div>
      </div>
    </div>
  );
};

export default Layout;

