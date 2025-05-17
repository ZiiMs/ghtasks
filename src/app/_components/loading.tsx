"use client";

import type React from 'react';

const Loading: React.FC = () => {
  return (
    <div className=" flex h-full flex-col items-center justify-center gap-2">
      <div
        style={{
          borderTopColor: 'transparent',
        }}
        className="h-12 w-12 animate-spin items-center justify-center rounded-full border-4 border-red-500 border-solid"
      />
      <span className='text-2xl '>Loading...</span>
    </div>
  );
};

export default Loading;
