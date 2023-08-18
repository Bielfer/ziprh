import { router, privateProcedure } from "~/server/trpc";
import { tryCatch } from "~/helpers/try-catch";
import { prisma } from "~/prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { isRole } from "../middlewares";
import { roles } from "~/constants/roles";

export const clockInsRouter = router({
  employee: privateProcedure
    .use(isRole(roles.basicMember))
    .mutation(async ({ ctx }) => {
      const { userId, orgId } = ctx.auth;

      if (!orgId)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No organization provided!",
        });

      const [clockIn, error] = await tryCatch(
        prisma.clockIn.create({
          data: {
            punchTime: new Date(),
            userId,
            organizationId: orgId,
          },
        })
      );

      if (error) throw new TRPCError({ code: "BAD_REQUEST", message: error });

      return clockIn;
    }),
  employer: privateProcedure
    .input(
      z.object({
        punchTime: z.date(),
        userId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { orgId } = ctx.auth;
      const { punchTime, userId } = input;

      if (!orgId)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No organization provided!",
        });

      const [clockIn, error] = await tryCatch(
        prisma.clockIn.create({
          data: {
            punchTime,
            userId,
            organizationId: orgId,
          },
        })
      );

      if (error) throw new TRPCError({ code: "BAD_REQUEST", message: error });

      return clockIn;
    }),
  edit: privateProcedure
    .use(isRole(roles.admin))
    .input(
      z.object({
        punchTime: z.date(),
        id: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { orgId } = ctx.auth;
      const { punchTime, id } = input;

      if (!orgId)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No organization provided!",
        });

      const [clockIn, error] = await tryCatch(
        prisma.$transaction(async (tx) => {
          const clockInData = await tx.clockIn.findUnique({ where: { id } });

          if (clockInData?.organizationId !== orgId)
            throw new Error("You don't have access to this organization!");

          const updatedClockIn = await tx.clockIn.update({
            where: {
              id,
            },
            data: {
              punchTime,
            },
          });

          return updatedClockIn;
        })
      );

      if (error) throw new TRPCError({ code: "BAD_REQUEST", message: error });

      return clockIn;
    }),
  delete: privateProcedure
    .use(isRole(roles.admin))
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { orgId } = ctx.auth;
      const { id } = input;

      if (!orgId)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No organization provided!",
        });

      const [clockIn, error] = await tryCatch(
        prisma.$transaction(async (tx) => {
          const clockInData = await tx.clockIn.findUnique({ where: { id } });

          if (clockInData?.organizationId !== orgId)
            throw new Error("You don't have access to this organization!");

          const deletedClockIn = await tx.clockIn.delete({
            where: {
              id,
            },
          });

          return deletedClockIn;
        })
      );

      if (error) throw new TRPCError({ code: "BAD_REQUEST", message: error });

      return clockIn;
    }),
});

export type ClockInsRouter = typeof clockInsRouter;
