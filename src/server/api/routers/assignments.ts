import { Status, Type } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import type { paths } from "~/types/gitSchema";

export const assignmentRouter = createTRPCRouter({
  get: protectedProcedure.input(z.object({
    id: z.number(),
  })).query(async ({ ctx, input }) => {
    const assignment = await ctx.db.assignments.findFirstOrThrow({
      where: {
        id: input.id,
      },
    })
    return assignment ?? null;
  }),
  getAll: protectedProcedure.input(z.object({
    projectId: z.number(),
  })).query(async ({ ctx, input }) => {
    if (input.projectId === -1) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Project ID is required",
      });
    }
    const assignments = await ctx.db.assignments.findMany({
      where: {
        projectId: input.projectId,
      }
    })
    return assignments ?? null;
  }),
  create: protectedProcedure
    .input(z.object({
      name: z.string().min(1),
      description: z.string().optional(),
      projectId: z.number(),
      status: z.nativeEnum(Status),
      statusColor: z.string(),
      type: z.nativeEnum(Type),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.assignments.create({
        data: {
          name: input.name,
          description: input.description || null,
          projectId: input.projectId,
          status: input.status,
          statusColor: input.statusColor,
          type: input.type,
        },
      })
    }),
  delete: protectedProcedure.input(z.object({
    id: z.number(),
  })).mutation(async ({ ctx, input }) => {
    const assignment = await ctx.db.assignments.delete({
      where: {
        id: input.id,
      },
    });
    if (!assignment) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Assignment not found",
      });
    }
    return assignment;
  }),

});