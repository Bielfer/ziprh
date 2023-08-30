import { router, privateProcedure } from "~/server/trpc";
import { z } from "zod";
import { tryCatch } from "~/helpers/try-catch";
import { prisma } from "~/prisma/client";
import { type EmployeeSchedule } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { clerkClient } from "@clerk/nextjs";
import { type OrganizationMembership } from "@clerk/nextjs/dist/types/server";
import { hasOrganization, isRole } from "../middlewares";
import { roles } from "~/constants/roles";
import { scheduleTypesValues } from "~/constants/schedule-types";

const formatDailySchedule = (days?: number[]) => {
  return {
    sunday: days?.includes(0),
    monday: days?.includes(1),
    tuesday: days?.includes(2),
    wednesday: days?.includes(3),
    thursday: days?.includes(4),
    friday: days?.includes(5),
    saturday: days?.includes(6),
  };
};

const dailyScheduleToNumbers = ({
  organizationMembership,
  schedule,
}: {
  organizationMembership: OrganizationMembership[];
  schedule: EmployeeSchedule;
}) => {
  const {
    id,
    createdAt,
    updatedAt,
    beginning,
    end,
    organizationId,
    userId,
    ...days
  } = schedule;

  const daysToNumber = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  } as const;

  const member = organizationMembership.find(
    (member) => member.publicUserData?.userId === userId
  );

  return {
    id,
    createdAt,
    updatedAt,
    beginning,
    end,
    organizationId,
    userId,
    userFullName: member?.publicUserData?.firstName
      ? `${member?.publicUserData?.firstName} ${
          member?.publicUserData?.lastName ?? ""
        }`
      : "Sem Nome",
    userImage: member?.publicUserData?.imageUrl,
    days: Object.entries(days)
      .filter(([, value]) => value)
      .map(([key]) => daysToNumber[key as keyof typeof daysToNumber]),
  };
};

export const schedulesRouter = router({
  getMany: privateProcedure
    .input(
      z.object({
        userId: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { orgId } = ctx.auth;
      const { userId } = input;

      if (!orgId)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No organization provided!",
        });

      const [organizationMembership, errorOrganization] = await tryCatch(
        clerkClient.organizations.getOrganizationMembershipList({
          organizationId: orgId,
          limit: 20,
        })
      );

      if (errorOrganization || !organizationMembership)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: errorOrganization,
        });

      const [schedules, error] = await tryCatch(
        prisma.employeeSchedule.findMany({
          where: {
            organizationId: orgId,
            ...(!!userId
              ? { userId }
              : {
                  userId: {
                    in: organizationMembership.map(
                      (member) => member.publicUserData?.userId ?? ""
                    ),
                  },
                }),
          },
        })
      );

      if (error) throw new TRPCError({ code: "BAD_REQUEST", message: error });

      const employeeSchedules = schedules?.map((schedule) =>
        dailyScheduleToNumbers({ schedule, organizationMembership })
      );

      return employeeSchedules;
    }),
  create: privateProcedure
    .use(isRole(roles.admin))
    .use(hasOrganization)
    .input(
      z.object({
        beginning: z.string().min(4).max(5),
        end: z.string().min(4).max(5),
        days: z.number().array().min(1).optional(),
        employeeId: z.string(),
        type: z.enum(scheduleTypesValues).optional(),
        daysOff: z.number().optional(),
        daysWorked: z.number().optional(),
        firstDayOff: z.date().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { orgId } = ctx.auth;
      const { days, ...filteredInput } = input;

      const dailySchedule = formatDailySchedule(days);

      const [schedule, error] = await tryCatch(
        prisma.employeeSchedule.create({
          data: {
            ...dailySchedule,
            ...filteredInput,
            userId: input.employeeId,
            organizationId: orgId,
          },
        })
      );

      if (error) throw new TRPCError({ code: "BAD_REQUEST", message: error });

      return schedule;
    }),
  update: privateProcedure
    .use(isRole(roles.admin))
    .use(hasOrganization)
    .input(
      z.object({
        id: z.number(),
        beginning: z.string().min(4).max(5),
        end: z.string().min(4).max(5),
        employeeId: z.string(),
        days: z.number().array().min(1).optional(),
        type: z.enum(scheduleTypesValues).optional(),
        daysOff: z.number().optional(),
        daysWorked: z.number().optional(),
        firstDayOff: z.date().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { orgId } = ctx.auth;
      const { days, ...filteredInput } = input;

      const dailySchedule = formatDailySchedule(days);

      const [schedule, error] = await tryCatch(
        prisma.employeeSchedule.update({
          where: {
            id: input.id,
          },
          data: {
            ...dailySchedule,
            ...filteredInput,
            userId: input.employeeId,
            organizationId: orgId,
          },
        })
      );

      if (error) throw new TRPCError({ code: "BAD_REQUEST", message: error });

      return schedule;
    }),
  delete: privateProcedure
    .use(isRole(roles.admin))
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const { id } = input;

      const [deletedSchedule, error] = await tryCatch(
        prisma.employeeSchedule.delete({ where: { id } })
      );

      if (error) throw new TRPCError({ code: "BAD_REQUEST", message: error });

      return deletedSchedule;
    }),
});

export type SchedulesRouter = typeof schedulesRouter;
