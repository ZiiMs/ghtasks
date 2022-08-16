import { NotFoundError } from '@prisma/client/runtime';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { paths } from '../../types/schema2';
import { createProtectedRouter } from './protected-router';

// Example router with queries that can only be hit if the user requesting is signed in
export const RepoRouter = createProtectedRouter()
  .query('get', {
    async resolve({ ctx }) {
      const account = await ctx.prisma.account.findFirstOrThrow({
        where: {
          userId: ctx.session.user.id,
        },
      });
      if (!account) {
        throw new TRPCError({
          code: 'NOT_FOUND',

          message: 'Account not found',
        });
      }
      const found = await fetch('https://api.github.com/user/repos', {
        method: 'GET',
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `token ${account.access_token}`,
        },
      });
      const status = found.status;
      if (status !== 200) {
        throw new TRPCError({
          code: 'NOT_FOUND',

          message: `Error fetching: Status: ${status}`,
        });
      }
      const repos: paths['/user/repos']['get']['responses']['200']['content']['application/json'] =
        await found.json();

      return [...repos];
    },
  })
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
  .query('get-user', {
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
  });

