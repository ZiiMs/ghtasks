import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import type { paths } from "~/types/gitSchema";

export const projectRouter = createTRPCRouter({
  get: protectedProcedure.input(z.object({
    repoId: z.number(),
  })).query(async ({ ctx, input }) => {
    const project = await ctx.db.project.findFirstOrThrow({
      where: {
        repoId: input.repoId,
        Users: {
          some: {
            id: ctx.session.user.id,
          }
        }
      },
    })
    return project ?? null;
  }),
  getAll: protectedProcedure.query(async ({ ctx, input }) => {
    const projects = await ctx.db.project.findMany({
      where: {
        Users: {
          some: {
            id: ctx.session.user.id,
          }
        }
      },
    })
    return projects ?? null;
  }),
  create: protectedProcedure
    .input(z.object({
      name: z.string().min(1),
      description: z.string().optional(),
      repoId: z.number(),
      stars: z.number(),
      forks: z.number(),
      branch: z.string(),
      ownerName: z.string(),
      ownerAvatar: z.string(),
      url: z.string().url(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.project.create({
        data: {
          name: input.name,
          description: input.description,
          repoId: input.repoId,
          url: input.url,
          stars: input.stars,
          forks: input.forks,
          branch: input.branch,
          ownerName: input.ownerName,
          ownerAvatar: input.ownerAvatar,
          Users: {
            connect: {
              id: ctx.session.user.id,
            }
          }
        },
      })
    }),

  delete: protectedProcedure.input(z.object({
    id: z.number(),
  })).mutation(async ({ ctx, input }) => {
    const project = await ctx.db.project.delete({
      where: {
        id: input.id,
      },
    });

    if (!project) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Project not found",
      });
    }


    return project;
  }),
});