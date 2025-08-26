import { user } from "@/db/schema/auth";
import { protectedProcedure } from "@/lib/trpc";
import type { TRPCRouterRecord } from "@trpc/server";


export const userRouter = {
  getAll: protectedProcedure.query(
    async ({ ctx }) => await ctx.db.select().from(user),
  ),
} satisfies TRPCRouterRecord;
