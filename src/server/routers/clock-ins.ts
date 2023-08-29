import { router, privateProcedure } from "~/server/trpc";
import { tryCatch } from "~/helpers/try-catch";
import { prisma } from "~/prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { isRole } from "../middlewares";
import { roles } from "~/constants/roles";
import { type ClockIn } from "@prisma/client";
import { differenceInMinutes, isSameDay } from "date-fns";
import { minutesToTime } from "~/helpers/times";

const getEmployeesHoursWorked = (clockIns: ClockIn[]) => {
  const clockInsByEmployee: Record<string, ClockIn[]> = {};

  for (const clockIn of clockIns) {
    const { userId } = clockIn;

    if (!clockInsByEmployee[userId]) {
      clockInsByEmployee[userId] = [clockIn];
      continue;
    }

    clockInsByEmployee[userId]?.push(clockIn);
  }

  const employeesHoursWorked: Record<string, string> = {};

  for (const employee of Object.entries(clockInsByEmployee)) {
    let minutesWorked = 0;
    const [userId, employeeClockIns] = employee;
    let previousPunchTime: Date | undefined = undefined;
    let punchTimesInDay = 2;

    for (const clockIn of employeeClockIns) {
      const { punchTime } = clockIn;

      if (isSameDay(punchTime, previousPunchTime ?? new Date(1999))) {
        if (punchTimesInDay % 2 === 0)
          minutesWorked += differenceInMinutes(
            punchTime,
            previousPunchTime ?? new Date(1999)
          );

        punchTimesInDay++;
      } else {
        punchTimesInDay = 2;
      }

      previousPunchTime = punchTime;
    }

    employeesHoursWorked[userId] = minutesToTime(minutesWorked);
  }

  return employeesHoursWorked;
};

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
  employeesHoursWorked: privateProcedure
    .input(
      z.object({
        startDate: z.date(),
        endDate: z.date(),
        userId: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const { startDate, endDate, userId } = input;

      const [clockIns, error] = await tryCatch(
        prisma.clockIn.findMany({
          where: {
            punchTime: {
              gte: startDate,
              lte: endDate,
            },
            ...(userId && { userId }),
          },
          orderBy: {
            punchTime: "asc",
          },
        })
      );

      if (error ?? !clockIns)
        throw new TRPCError({ code: "BAD_REQUEST", message: error });

      const employeesHoursWorked = getEmployeesHoursWorked(clockIns);

      return employeesHoursWorked;
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
