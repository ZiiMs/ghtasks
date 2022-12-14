import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createProtectedRouter } from './protected-router';

// Example router with queries that can only be hit if the user requesting is signed in
export const ProjectRouter = createProtectedRouter()
  .mutation('create', {
    input: z.object({
      name: z.string(),
      description: z.string().optional(),
      repoId: z.number(),
    }),
    async resolve({ ctx, input }) {
      console.log('input', input);
      try {
        const repo = await ctx.prisma.project.create({
          data: {
            repoId: input.repoId,
            name: input.name,
            description: input.description || null,
            Users: {
              connect: {
                id: ctx.session.user.id,
              },
            },
          },
        });
        return repo;
      } catch (e) {
        console.error(e);
        throw new TRPCError({
          code: 'PARSE_ERROR',
          message: 'Error creating repo',
          cause: e,
        });
      }
    },
  })
  .mutation('delete', {
    input: z.object({
      id: z.number(),
    }),
    async resolve({ ctx, input }) {
      console.log('input', input);
      try {
        const repo = await ctx.prisma.project.delete({
          where: {
            id: input.id,
          },
        });
        return repo;
      } catch (e) {
        console.error(e);
        throw new TRPCError({
          code: 'PARSE_ERROR',
          message: 'Error deleteing repo',
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
        });

        return {
          ...repos,
        };

        // const {"0": Project, "1": Notes, "2": Todos} = await Promise.all([repos, repos.Notes(), repos.Todos()]);
        // return {
        //   ...Project,
        //   Notes: Notes ?? [],
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

