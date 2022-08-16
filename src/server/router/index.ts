// src/server/router/index.ts
import superjson from 'superjson';
import { BoardRouter } from './board';
import { createRouter } from './context';
import { ProjectRouter } from './project';

import { RepoRouter } from './repos';

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('repo.', RepoRouter)
  .merge('board.', BoardRouter)
  .merge('project.', ProjectRouter);

// export type definition of API
export type AppRouter = typeof appRouter;

