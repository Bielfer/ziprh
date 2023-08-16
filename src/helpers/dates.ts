import {
  startOfMonth,
  lastDayOfMonth as getLastDayOfMonth,
  getDay,
  addDays,
  differenceInCalendarDays,
} from "date-fns";

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
