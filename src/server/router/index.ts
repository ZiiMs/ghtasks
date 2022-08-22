// src/server/router/index.ts
import superjson from 'superjson';
import { z } from 'zod';
import { createRouter } from './context';
import { ProjectRouter } from './project';

import { AssignmentRouter } from './assignments';
import { RepoRouter } from './repos';

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('repo.', RepoRouter)
  .merge('assignments.', AssignmentRouter)
  .merge('project.', ProjectRouter);

// export type definition of API
export type AppRouter = typeof appRouter;

