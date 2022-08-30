import React from 'react';

const Loading: React.FC = () => {
  return (
    <div className=' flex flex-col items-center justify-center gap-2 h-full'>
      <div
        style={{
          borderTopColor: 'transparent',
        }}
        className='w-12 h-12 border-4 items-center justify-center border-red-500 border-solid rounded-full animate-spin'
      />
      <span className='text-2xl '>Loading...</span>
    </div>
  );
};

export default Loading;
