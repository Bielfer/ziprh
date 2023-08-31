import type { EmployeeScheduleType } from "@prisma/client";

export const scheduleTypes = {
  interval: "INTERVAL",
  customizable: "CUSTOMIZABLE",
} as const;

export const scheduleTypesValues = Object.values(
  scheduleTypes
) as unknown as readonly [EmployeeScheduleType, ...EmployeeScheduleType[]];
