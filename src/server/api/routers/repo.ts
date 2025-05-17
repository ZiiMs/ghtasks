import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import type { paths } from "~/types/gitSchema";

export const repoRouter = createTRPCRouter({

  get: protectedProcedure.query(async ({ ctx }) => {
    const account = await ctx.db.account.findFirstOrThrow({ where: { userId: ctx.session.user.id } }).catch(() => {
      throw new TRPCError({ code: "NOT_FOUND", message: "Account not found" });
    });
    const found = await fetch('https://api.github.com/user/repos', {
      method: 'GET',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `token ${account.access_token}`,
      }
    })
    if (found.status !== 200) {
      throw new TRPCError({ code: "PARSE_ERROR", message: `ERROR Fetching:  ${found.status}` });
    }
    const repos: paths['/user/repos']['get']['responses']['200']['content']['application/json'] = await found.json();

    return [...repos]
  }),

});