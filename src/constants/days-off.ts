import type { DayOffType } from "@prisma/client";

export const dayOffTypes = {
  oneTime: "ONE_TIME",
  recurring: "RECURRING",
} as const;

export const dayOffTypesValues = Object.values(
  dayOffTypes
) as unknown as readonly [DayOffType, ...DayOffType[]];
