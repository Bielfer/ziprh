import { router, privateProcedure } from "~/server/trpc";
import { z } from "zod";
import { tryCatch } from "~/helpers/try-catch";
import { prisma } from "~/prisma/client";
import { type EmployeeSchedule } from "@prisma/client";
import { TRPCError } from "@trpc/server";

const formatDailySchedule = (schedule: {
  days: number[];
  beginning: string;
  end: string;
}) => {
  return {
    sunday: schedule.days.includes(0),
    monday: schedule.days.includes(1),
    tuesday: schedule.days.includes(2),
    wednesday: schedule.days.includes(3),
    thursday: schedule.days.includes(4),
    friday: schedule.days.includes(5),
    saturday: schedule.days.includes(6),
  };
};

const dailyScheduleToNumbers = ({
  id,
  createdAt,
  updatedAt,
  beginning,
  end,
  organizationId,
  userId,
  ...days
}: EmployeeSchedule) => {
  const daysToNumber = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  } as const;
  return {
    id,
    createdAt,
    updatedAt,
    beginning,
    end,
    organizationId,
    userId,
    days: Object.entries(days)
      .filter(([, value]) => value)
      .map(([key]) => daysToNumber[key as keyof typeof daysToNumber]),
  };
};

export const schedulesRouter = router({
  getMany: privateProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { orgId } = ctx.auth;
      const { userId } = input;

      const [schedules, error] = await tryCatch(
        prisma.employeeSchedule.findMany({
          where: {
            userId,
            organizationId: orgId,
          },
        })
      );

      if (error) throw new TRPCError({ code: "BAD_REQUEST", message: error });

      const employeeSchedules = schedules?.map(dailyScheduleToNumbers);

      return employeeSchedules;
    }),
  upsertMany: privateProcedure
    .input(
      z.object({
        employeeSchedules: z
          .object({
            beginning: z.string().min(4).max(5),
            end: z.string().min(4).max(5),
            days: z.number().array().min(1),
            id: z.number(),
          })
          .array(),
        employeeId: z.string(),
        deleteSchedules: z.number().array(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { orgId } = ctx.auth;
      const { employeeSchedules, employeeId, deleteSchedules } = input;

      if (!orgId)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No organization provided!",
        });

      const [upsertSchedules, error] = await tryCatch(
        prisma.$transaction(async (tx) => {
          for (const toDeleteId of deleteSchedules) {
            await tx.employeeSchedule.delete({ where: { id: toDeleteId } });
          }

          const savedSchedules: EmployeeSchedule[] = [];

          for (const schedule of employeeSchedules) {
            const { beginning, end } = schedule;
            const dailySchedule = formatDailySchedule(schedule);

            const savedClockIn = await tx.employeeSchedule.upsert({
              where: { id: schedule.id },
              update: dailySchedule,
              create: {
                ...dailySchedule,
                userId: employeeId,
                organizationId: orgId,
                beginning,
                end,
              },
            });

            savedSchedules.push(savedClockIn);
          }

          return savedSchedules;
        })
      );

      if (error) throw new TRPCError({ code: "BAD_REQUEST", message: error });

      return upsertSchedules;
    }),
});

export type SchedulesRouter = typeof schedulesRouter;
