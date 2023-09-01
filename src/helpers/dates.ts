import {
  startOfMonth,
  lastDayOfMonth as getLastDayOfMonth,
  getDay,
  addDays,
  differenceInCalendarDays,
  isSameDay,
} from "date-fns";
import { generateIntegerArray } from "./arrays";

export const generateMonth = (calendarDate: Date) => {
  const firstDayOfMonth = startOfMonth(calendarDate);
  const lastDayOfMonth = getLastDayOfMonth(calendarDate);
  const firstWeekDay = getDay(firstDayOfMonth);
  let day = firstDayOfMonth;

  if (firstWeekDay) {
    day = addDays(firstDayOfMonth, -firstWeekDay);
  }

  const month: Date[] = [];

  while (differenceInCalendarDays(day, lastDayOfMonth) < 0) {
    month.push(day);
    day = addDays(day, 1);
  }

  const missingDays = month.length % 7;

  for (let i = 0; i < 7 - missingDays; i++) {
    month.push(day);
    day = addDays(day, 1);
  }

  return month;
};

export const isIntervalSchedule = ({
  dateLeft,
  dateRight,
  daysWorked,
  daysOff,
}: {
  dateLeft: Date | null;
  dateRight: Date | null;
  daysWorked: number | null;
  daysOff: number | null;
}) => {
  if (!daysOff || !daysWorked || !dateLeft || !dateRight) return false;
  if (isSameDay(dateLeft, dateRight)) return false;

  const acceptedMultiples = generateIntegerArray(0, daysOff - 1);
  let daysBetween = differenceInCalendarDays(dateRight, dateLeft);

  if (daysBetween < 0) daysBetween = -daysBetween + daysOff - 1;

  if (acceptedMultiples.includes(daysBetween % (daysOff + daysWorked)))
    return false;

  return true;
};

export const generateDatesBetween = (startDate: Date, endDate: Date) => {
  let date = startDate;
  const dates: Date[] = [startDate];

  for (let i = 0; i < differenceInCalendarDays(endDate, startDate); i++) {
    date = addDays(date, 1);
    dates.push(date);
  }

  return dates;
};

export const startAndEndOfCalendarMonth = (date: Date) => {
  let firstDayOfMonth = startOfMonth(date);
  let lastDayOfMonth = getLastDayOfMonth(date);
  const firstWeekDay = getDay(firstDayOfMonth);
  const lastWeekDay = getDay(lastDayOfMonth);

  if (firstWeekDay) {
    firstDayOfMonth = addDays(firstDayOfMonth, -firstWeekDay);
  }

  if (lastWeekDay) {
    lastDayOfMonth = addDays(lastDayOfMonth, 6 - lastWeekDay);
  }

  return {
    firstDayOfMonth,
    lastDayOfMonth,
  };
};
