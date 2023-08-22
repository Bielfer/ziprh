import { router, privateProcedure } from "~/server/trpc";
import { z } from "zod";
import { hasOrganization, isRole } from "../middlewares";
import { tryCatch } from "~/helpers/try-catch";
import { prisma } from "~/prisma/client";
import { TRPCError } from "@trpc/server";

export const dayOffRouter = router({
  create: privateProcedure
    .use(isRole("admin"))
    .use(hasOrganization)
    .input(
      z.object({
        userId: z.string(),
        date: z.date(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, date } = input;
      const { orgId } = ctx.auth;

      const [dayOff, error] = await tryCatch(
        prisma.dayOff.create({
          data: {
            date,
            organizationId: orgId,
            userId,
          },
        })
      );

      if (error) throw new TRPCError({ code: "BAD_REQUEST", message: error });

      return dayOff;
    }),
  delete: privateProcedure
    .use(isRole("admin"))
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const { id } = input;

      const [deletedDayOff, error] = await tryCatch(
        prisma.dayOff.delete({
          where: { id },
        })
      );

      if (error) throw new TRPCError({ code: "BAD_REQUEST", message: error });

      return deletedDayOff;
    }),
});

export type DayOffRouter = typeof dayOffRouter;
