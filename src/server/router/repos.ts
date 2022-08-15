import { NotFoundError } from '@prisma/client/runtime';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { paths } from '../../types/schema2';
import { createProtectedRouter } from './protected-router';

// Example router with queries that can only be hit if the user requesting is signed in
export const RepoRouter = createProtectedRouter().query('get', {
  input: z.object({
    token: z.string(),
  }),
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
});

