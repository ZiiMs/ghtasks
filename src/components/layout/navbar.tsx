import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import React from 'react';
import { FaGithub } from 'react-icons/fa';

const Navbar: React.FC = () => {
  const { data: session } = useSession();

  return (
    <div>
      <nav className='navbar bg-slate-900 navbar-expand-lg flex flex-row items-center justify-between navbar-light w-screen bg-light px-4 py-2'>
        <button className='flex items-center gap-1'>
          <FaGithub />
          Tasks
        </button>
        {session?.user ? (
          <button onClick={() => {
            signOut();
          }}>
            <Image
              src={session.user.image ?? ''}
              alt={session.user.name ?? 'Unknown'}
              className={session.user.image ? 'bg-transparent' : ''}
              width={'32px'}
              height={'32px'}
            />
          </button>
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
      </nav>
    </div>
  );
};

export default Navbar;

