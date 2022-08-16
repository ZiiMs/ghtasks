import { useRouter } from 'next/router';
import React from 'react';


const RepoTodos: React.FC = () => {
  const router = useRouter()
  const { repoId } = router.query
  return (
    <div></div>
  );
};


export default RepoTodos;