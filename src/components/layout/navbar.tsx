import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { FaGithub } from 'react-icons/fa';

const Navbar: React.FC = () => {
  const { data: session, status } = useSession();

  const isLoading = status === 'loading';

  return (
    <nav className='navbar bg-slate-900 w-full '>
      <div className='container flex flex-row items-center justify-between h-full w-full z-10 px-4 py-2 mx-auto'>
        <div className='flex h-full'>
          <Link href={'/'} passHref className='flex'>
            <button className='items-center gap-1 flex flex-shrink-0 h-full hover:bg-slate-800 px-2 rounded-md hover:text-red-600 focus:outline-2 focus:outline-red-500 focus:outline'>
              <FaGithub />
              Notes
            </button>
          </Link>
        </div>
        <div className='flex gap-6'>
          <Link href={'/repo/new'} passHref className='flex'>
            <button className='flex items-center gap-1 hover:bg-slate-800 px-2 rounded-md hover:text-red-600 focus:outline-2 focus:outline-red-500 focus:outline'>
              New Project
            </button>
          </Link>
          {session?.user ? (
            <button
              onClick={() => {
                signOut();
              }}
            >
              <Image
                src={session.user.image ?? ''}
                alt={session.user.name ?? 'Unknown'}
                className={session.user.image ? 'bg-transparent' : ''}
                width={'32px'}
                height={'32px'}
              />
            </button>
          ) : (
            <>
              {isLoading ? (
                <div className='bg-slate-600 bg-opacity-20 p-2 rounded-md'>
                  <div
                    style={{
                      borderTopColor: 'transparent',
                    }}
                    className='w-6 h-6 border-2 border-slate-400 border-solid rounded-full animate-spin'
                  >
                    <span className='hidden'>Loading...</span>
                  </div>
                </div>
              ) : (
                <button
                  className='px-2 py-1 gap-1 flex flex-row items-center font-semibold bg-white text-gray-900 hover:bg-gray-100 active:bg-gray-100 active:scale-95 rounded-md'
                  onClick={() => {
                    signIn('github');
                  }}
                >
                  <FaGithub />
                  Sign in with Github
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

