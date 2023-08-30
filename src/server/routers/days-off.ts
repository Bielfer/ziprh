import { router, privateProcedure } from "~/server/trpc";
import { z } from "zod";
import { hasOrganization, isRole } from "../middlewares";
import { tryCatch } from "~/helpers/try-catch";
import { prisma } from "~/prisma/client";
import { TRPCError } from "@trpc/server";

export const dayOffRouter = router({
  getMany: privateProcedure
    .use(hasOrganization)
    .input(
      z.object({
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        userId: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const { startDate, endDate, userId } = input;

      const [daysOff, error] = await tryCatch(
        prisma.dayOff.findMany({
          where: {
            ...(!!startDate &&
              !!endDate && {
                date: {
                  lte: endDate,
                  gte: startDate,
                },
              }),
            ...(!!userId && { userId }),
          },
        })
      );

      if (error) throw new TRPCError({ code: "BAD_REQUEST", message: error });

      return daysOff;
    }),

  upsert: privateProcedure
    .use(isRole("admin"))
    .use(hasOrganization)
    .input(
      z.object({
        id: z.number().optional(),
        userId: z.string().optional(),
        date: z.date().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, id, ...filteredInput } = input;
      const { orgId } = ctx.auth;

      const [dayOff, error] = await tryCatch(
        prisma.dayOff.upsert({
          where: { id: id ?? -1 },
          create: {
            ...filteredInput,
            userId: userId ?? "",
            date: filteredInput.date ?? new Date(1999),
            organizationId: orgId,
          },
          update: filteredInput,
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
