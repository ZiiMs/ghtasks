import Head from 'next/head';
import React, { PropsWithChildren } from 'react';
import Navbar from './navbar';

const Layout = ({ children }: PropsWithChildren<{}>) => {
  return (
    <main className='min-h-screen min-w-screen'>
      <Navbar />
      <div className='container mx-auto flex items-center justify-center p-4'>
        {children}
      </div>
    </main>
  );
};

export default Layout;

