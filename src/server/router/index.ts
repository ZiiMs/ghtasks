// src/server/router/index.ts
import superjson from 'superjson';
import { createRouter } from './context';
import { ProjectRouter } from './project';

import { RepoRouter } from './repos';

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('repo.', RepoRouter)
  .merge('project.', ProjectRouter);

// export type definition of API
export type AppRouter = typeof appRouter;

