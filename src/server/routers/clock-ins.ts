import { router, privateProcedure } from "~/server/trpc";
import { tryCatch } from "~/helpers/try-catch";
import { prisma } from "~/prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { isRole } from "../middlewares";
import { roles } from "~/constants/roles";
import { type ClockIn } from "@prisma/client";

export const clockInsRouter = router({
  getMany: privateProcedure
    .input(
      z.object({
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        userId: z.string(),
      })
    )
    .query(async ({ input }) => {
      const { endDate, startDate, userId } = input;

      const hasInterval = !!startDate && !!endDate;

      const [clockIns, error] = await tryCatch(
        prisma.clockIn.findMany({
          where: {
            userId,
            ...(hasInterval && {
              punchTime: {
                gte: startDate,
                lte: endDate,
              },
            }),
          },
          orderBy: {
            punchTime: "asc",
          },
        })
      );

      if (error) throw new TRPCError({ code: "BAD_REQUEST", message: error });

      return clockIns;
    }),
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
  upsertMany: privateProcedure
    .input(
      z.object({
        userId: z.string(),
        clockIns: z
          .object({
            punchTime: z.date(),
            id: z.number(),
          })
          .array(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { orgId } = ctx.auth;
      const { clockIns, userId } = input;

      if (!orgId)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No organization provided!",
        });

      const [upsertClockIns, error] = await tryCatch(
        prisma.$transaction(async (tx) => {
          const savedClockIns: ClockIn[] = [];

          for (const clockIn of clockIns) {
            const savedClockIn = await tx.clockIn.upsert({
              where: { id: clockIn.id },
              update: {
                punchTime: clockIn.punchTime,
              },
              create: {
                userId,
                organizationId: orgId,
                punchTime: clockIn.punchTime,
              },
            });

            savedClockIns.push(savedClockIn);
          }

          return savedClockIns;
        })
      );

      if (error) throw new TRPCError({ code: "BAD_REQUEST", message: error });

      return upsertClockIns;
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
