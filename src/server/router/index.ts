// src/server/router/index.ts
import superjson from 'superjson';
import { createRouter } from './context';

import { RepoRouter } from './repos';

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('repo.', RepoRouter);

// export type definition of API
export type AppRouter = typeof appRouter;

