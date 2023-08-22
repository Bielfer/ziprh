"use client";
import { type FC } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import cn from "~/helpers/cn";
import {
  getDate,
  getMonth,
  getYear,
  isSameMonth,
  isToday as getIsToday,
} from "date-fns";
import { dayAbbreviations, monthNames } from "~/constants/dates";

type Props = {
  days: { time: Date; events: { name: string; time: string }[] }[];
  onDayClick?: (day: Date) => void;
  goToNextMonth: () => void;
  goToPreviousMonth: () => void;
  date: Date;
  exceedingMessage?: string;
};

const CalendarMonthView: FC<Props> = ({
  days,
  onDayClick,
  goToNextMonth,
  goToPreviousMonth,
  date,
  exceedingMessage = "",
}) => {
  return (
    <div className="lg:flex lg:h-full lg:flex-col">
      <header className="flex items-center justify-between py-4 lg:flex-none">
        <div className="mb-4 mt-6 flex items-center">
          <div className="relative flex items-center rounded-md bg-white shadow-sm md:items-stretch">
            <div
              className="pointer-events-none absolute inset-0 rounded-md ring-1 ring-inset ring-gray-300"
              aria-hidden="true"
            />
            <button
              type="button"
              className="flex items-center justify-center rounded-l-md py-2 pl-3 pr-4 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:px-2 md:hover:bg-gray-50"
              onClick={goToPreviousMonth}
            >
              <span className="sr-only">Mês Anterior</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <div className="flex items-center justify-center px-3.5 text-sm font-semibold text-gray-900 focus:relative">
              {monthNames[getMonth(date)]} {getYear(date)}
            </div>
            <button
              type="button"
              className="flex items-center justify-center rounded-r-md py-2 pl-4 pr-3 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:px-2 md:hover:bg-gray-50"
              onClick={goToNextMonth}
            >
              <span className="sr-only">Próximo Mês</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>
      <div className="overflow-hidden rounded-lg shadow ring-1 ring-black ring-opacity-5 lg:flex lg:flex-auto lg:flex-col">
        <div className="grid grid-cols-7 gap-px border-b border-gray-300 bg-gray-200 text-center text-xs font-semibold leading-6 text-gray-700 lg:flex-none">
          {dayAbbreviations.map((day) => (
            <div className="bg-white py-2" key={day}>
              {day}
            </div>
          ))}
        </div>
        <div className="flex bg-gray-200 text-xs leading-6 text-gray-700 lg:flex-auto">
          <div className="hidden w-full lg:grid lg:grid-cols-7 lg:gap-px">
            {days.map((day) => {
              const isToday = getIsToday(day.time);
              const isCurrentMonth = isSameMonth(day.time, date);

              return (
                <button
                  key={day.time.toDateString()}
                  className={cn(
                    isCurrentMonth
                      ? "cursor-pointer bg-white hover:bg-gray-100"
                      : "cursor-default bg-gray-50 text-gray-500",
                    "relative flex flex-col px-3 py-2 text-left"
                  )}
                  onClick={() => {
                    if (!isCurrentMonth) return;
                    if (onDayClick) onDayClick(day.time);
                  }}
                >
                  <time
                    dateTime={day.time.toDateString()}
                    className={
                      isToday
                        ? "flex h-6 w-6 items-center justify-center rounded-full bg-primary-600 font-semibold text-white"
                        : undefined
                    }
                  >
                    {getDate(day.time)}
                  </time>
                  {day.events.length > 0 ? (
                    <ol className="mt-2">
                      {day.events.slice(0, 2).map((event) => (
                        <li key={event.name}>
                          <div className="group flex">
                            <p className="flex-auto truncate font-medium text-gray-900">
                              {event.name}
                            </p>
                            <time
                              dateTime={event.time}
                              className="ml-3 hidden flex-none text-gray-500 xl:block"
                            >
                              {event.time}
                            </time>
                          </div>
                        </li>
                      ))}
                      {day.events.length > 2 && (
                        <li className="text-gray-500">
                          + {day.events.length - 2} {exceedingMessage}
                        </li>
                      )}
                    </ol>
                  ) : (
                    <div className="h-10">-</div>
                  )}
                </button>
              );
            })}
          </div>
          <div className="isolate grid w-full grid-cols-7 gap-px lg:hidden">
            {days.map((day) => {
              const isToday = getIsToday(day.time);
              const isCurrentMonth = isSameMonth(day.time, date);

              return (
                <button
                  key={day.time.toDateString()}
                  type="button"
                  className={cn(
                    isCurrentMonth
                      ? "bg-white"
                      : "pointer-events-none bg-gray-50",
                    isToday && "font-semibold",
                    isToday && "text-primary-600",
                    isCurrentMonth && !isToday && "text-gray-900",
                    !isCurrentMonth && !isToday && "text-gray-500",
                    "flex h-14 flex-col px-3 py-2 hover:bg-gray-100 focus:z-10"
                  )}
                  onClick={() => {
                    if (!isCurrentMonth) return;
                    if (onDayClick) onDayClick(day.time);
                  }}
                >
                  <time
                    dateTime={day.time.toDateString()}
                    className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-full",
                      isToday && "bg-primary-600 text-white",
                      "ml-auto"
                    )}
                  >
                    {getDate(day.time)}
                  </time>
                  <span className="sr-only">{day.events.length} events</span>
                  {day.events.length > 0 && (
                    <span className="-mx-0.5 mt-auto flex flex-wrap-reverse">
                      {day.events.map((event) => (
                        <span
                          key={event.name}
                          className="mx-0.5 mb-1 h-1.5 w-1.5 rounded-full bg-gray-400"
                        />
                      ))}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarMonthView;
