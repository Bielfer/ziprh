import type { DayOffType } from "@prisma/client";

export const dayOffTypes = {
  dayOff: "DAY_OFF",
  workDay: "WORK_DAY",
} as const;

export const dayOffTypesValues = Object.values(
  dayOffTypes
) as unknown as readonly [DayOffType, ...DayOffType[]];
