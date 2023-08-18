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
import { generateMonth } from "~/helpers/dates";

const Calendar: FC = () => {
  const today = new Date();
  const days = generateMonth(today);

  const events = [
    {
      name: "Ponto 1",
      time: "8:00",
    },
    {
      name: "Ponto 2",
      time: "12:00",
    },
    {
      name: "Ponto 3",
      time: "14:00",
    },
    {
      name: "Ponto 3",
      time: "18:00",
    },
  ];

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
            >
              <span className="sr-only">Mês Anterior</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <div className="flex items-center justify-center px-3.5 text-sm font-semibold text-gray-900 focus:relative">
              {monthNames[getMonth(today)]} {getYear(today)}
            </div>
            <button
              type="button"
              className="flex items-center justify-center rounded-r-md py-2 pl-4 pr-3 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:px-2 md:hover:bg-gray-50"
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
              const isToday = getIsToday(day);
              const isCurrentMonth = isSameMonth(day, today);

              return (
                <div
                  key={day.toDateString()}
                  className={cn(
                    isCurrentMonth
                      ? "cursor-pointer bg-white hover:bg-gray-100"
                      : "bg-gray-50 text-gray-500",
                    "relative px-3 py-2"
                  )}
                >
                  <time
                    dateTime={day.toDateString()}
                    className={
                      isToday
                        ? "flex h-6 w-6 items-center justify-center rounded-full bg-primary-600 font-semibold text-white"
                        : undefined
                    }
                  >
                    {getDate(day)}
                  </time>
                  {events.length > 0 ? (
                    <ol className="mt-2">
                      {events.slice(0, 2).map((event) => (
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
                      {events.length > 2 && (
                        <li className="text-gray-500">
                          + {events.length - 2} pontos
                        </li>
                      )}
                    </ol>
                  ) : (
                    <div className="text-gray-500">Nenhum ponto batido</div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="isolate grid w-full grid-cols-7 gap-px lg:hidden">
            {days.map((day) => {
              const isToday = getIsToday(day);
              const isCurrentMonth = isSameMonth(day, today);

              return (
                <button
                  key={day.toDateString()}
                  type="button"
                  className={cn(
                    isCurrentMonth ? "bg-white" : "bg-gray-50",
                    isToday && "font-semibold",
                    isToday && "text-primary-600",
                    isCurrentMonth && !isToday && "text-gray-900",
                    !isCurrentMonth && !isToday && "text-gray-500",
                    "flex h-14 flex-col px-3 py-2 hover:bg-gray-100 focus:z-10"
                  )}
                >
                  <time
                    dateTime={day.toDateString()}
                    className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-full",
                      isToday && "bg-primary-600 text-white",
                      "ml-auto"
                    )}
                  >
                    {getDate(day)}
                  </time>
                  <span className="sr-only">{events.length} events</span>
                  {events.length > 0 && (
                    <span className="-mx-0.5 mt-auto flex flex-wrap-reverse">
                      {events.map((event) => (
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

export default Calendar;
