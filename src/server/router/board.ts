import { Type } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createProtectedRouter } from './protected-router';

// Example router with queries that can only be hit if the user requesting is signed in
export const BoardRouter = createProtectedRouter()
  .mutation('create', {
    input: z.object({
      name: z.string(),
      projectId: z.number(),
      type: z.nativeEnum(Type),
    }),
    async resolve({ ctx, input }) {
      console.log('input', input);
      try {
        const board = await ctx.prisma.board.create({
          data: {
            name: input.name,
            projectId: input.projectId,
            type: input.type,
          },
        });
        return board;
      } catch (e) {
        console.error(e);
        throw new TRPCError({
          code: 'PARSE_ERROR',
          message: 'Error creating board',
          cause: e,
        });
      }
    },
  })
  .query('get-all', {
    async resolve({ ctx }) {
      try {
        const repos = await ctx.prisma.project.findMany({
          where: {
            Users: {
              some: {
                id: ctx.session.user.id,
              },
            },
          },
        });
        return repos;
      } catch (e) {
        console.error(e);
        throw new TRPCError({
          code: 'PARSE_ERROR',
          message: 'Error fetching repos',
          cause: e,
        });
      }
    },
  })
  .query('get', {
    input: z.object({
      repoId: z.number(),
    }),
    async resolve({ ctx, input }) {
      try {
        const repos = await ctx.prisma.project.findFirstOrThrow({
          where: {
            repoId: input.repoId,
          },
          include: {
            Board: true,
          },
        });

        return {
          ...repos,
          Board: repos.Board ?? [],
        };

        // const {"0": Project, "1": Tasks, "2": Todos} = await Promise.all([repos, repos.Tasks(), repos.Todos()]);
        // return {
        //   ...Project,
        //   Tasks: Tasks ?? [],
        //   Todos: Todos ?? [],

        // };
      } catch (e) {
        console.error(e);
        throw new TRPCError({
          code: 'PARSE_ERROR',
          message: 'Error fetching repos',
          cause: e,
        });
      }
    },
  });

