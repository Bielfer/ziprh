import { router, privateProcedure } from "~/server/trpc";
import { tryCatch } from "~/helpers/try-catch";
import { prisma } from "~/prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { isRole } from "../middlewares";
import { roles } from "~/constants/roles";
import { type ClockIn } from "@prisma/client";
import { differenceInMinutes } from "date-fns";

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
  employeePunch: privateProcedure
    .use(isRole(roles.basicMember))
    .mutation(async ({ ctx }) => {
      const { userId, orgId } = ctx.auth;
      const punchTime = new Date();

      if (!orgId)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No organization provided!",
        });

      const [lastClockIn, errorSearching] = await tryCatch(
        prisma.clockIn.findFirst({
          where: {
            punchTime: {
              lte: punchTime,
            },
          },
          orderBy: {
            punchTime: "desc",
          },
        })
      );

      if (errorSearching)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Failed to find last clock in!",
        });

      if (
        lastClockIn &&
        differenceInMinutes(punchTime, lastClockIn.punchTime) < 5
      )
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message:
            "You can't punch the clock in intervals lower than 5 minutes",
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
        deleteClockIns: z.number().array(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { orgId } = ctx.auth;
      const { clockIns, userId, deleteClockIns } = input;

      if (!orgId)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No organization provided!",
        });

      const [upsertClockIns, error] = await tryCatch(
        prisma.$transaction(async (tx) => {
          for (const toDeleteId of deleteClockIns) {
            await tx.clockIn.delete({ where: { id: toDeleteId } });
          }

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
});

export type ClockInsRouter = typeof clockInsRouter;
