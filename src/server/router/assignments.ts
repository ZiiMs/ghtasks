import { Type } from '@prisma/client';
import { NotFoundError } from '@prisma/client/runtime';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { paths } from '../../types/schema2';
import { createProtectedRouter } from './protected-router';

// Example router with queries that can only be hit if the user requesting is signed in
export const AssignmentRouter = createProtectedRouter()
  .query('get', {
    input: z.object({
      id: z.number(),
    }),
    async resolve({ ctx, input }) {
      try {
        const assignment = await ctx.prisma.assignments.findFirstOrThrow({
          where: {
            id: input.id,
          },
        });
        return assignment;
      } catch (e) {
        console.log(e);
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'assignment not found',
          cause: e,
        });
      }
    },
  })
  .query('get-all', {
    input: z.object({
      projectId: z.number(),
    }),
    async resolve({ ctx, input }) {
      if (input.projectId === -1)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Project ID is invalid.',
          cause: input.projectId,
        });
      try {
        const assignments = await ctx.prisma.assignments.findMany({
          where: {
            projectId: input.projectId,
          },
        });
        return assignments;
      } catch (e) {
        console.log(e);
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'assignment not found',
          cause: e,
        });
      }
    },
  })
  .mutation('create', {
    input: z.object({
      name: z.string(),
      projectId: z.number(),
      description: z.string(),
      status: z.string(),
      statusColor: z.string(),
      type: z.nativeEnum(Type),
    }),
    async resolve({ ctx, input }) {
      try {
        const assignment = await ctx.prisma.assignments.create({
          data: {
            name: input.name,
            projectId: input.projectId,
            description: input.description || null,
            status: input.status,
            statusColor: input.statusColor,
          },
        });
        return assignment;
      } catch (e) {
        console.log(e);
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'assignment failed to create',
          cause: e,
        });
      }
    },
  });

