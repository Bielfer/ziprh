import { dayAbbreviations, monthNames } from '~/constants/dates';
import { generateIntegerArray } from '~/helpers/arrays';
import { Listbox } from '@headlessui/react';
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/20/solid';
import clsx from 'clsx';
import {
  addDays,
  addMonths,
  addYears,
  differenceInCalendarDays,
  formatISO,
  getDate,
  getDay,
  getMonth,
  getYear,
  isSameDay,
  isSameMonth,
  isToday as getIsToday,
  lastDayOfMonth as getLastDayOfMonth,
  startOfMonth,
} from 'date-fns';
import {
  type Dispatch,
  type FC,
  type SetStateAction,
  useCallback,
  useMemo,
  useState,
} from 'react';
import cn from '~/helpers/cn';

type Props = {
  date: Date;
  setDate: Dispatch<SetStateAction<Date>>;
  onDateSelected?: () => void;
  className?: string;
};

const Calendar: FC<Props> = ({
  date: selectedDate,
  setDate: setSelectedDate,
  className,
  onDateSelected,
}) => {
  const [calendarDate, setCalendarDate] = useState(selectedDate);

  const generateCalendar = useCallback(() => {
    const firstDayOfMonth = startOfMonth(calendarDate);
    const lastDayOfMonth = getLastDayOfMonth(calendarDate);
    const firstWeekDay = getDay(firstDayOfMonth);
    let day = firstDayOfMonth;

    if (firstWeekDay) {
      day = addDays(firstDayOfMonth, -firstWeekDay);
    }

    const month: Date[][] = [];

    while (differenceInCalendarDays(day, lastDayOfMonth) < 0) {
      let i = 0;
      const week: Date[] = [];

      while (i < 7) {
        week.push(day);
        day = addDays(day, 1);
        i += 1;
      }

      month.push(week);
    }

    return month;
  }, [calendarDate]);

  const calendar = useMemo(() => generateCalendar(), [generateCalendar]);

  const goToPreviousMonth = () => {
    setCalendarDate((prev) => addMonths(prev, -1));
  };

  const goToNextMonth = () => {
    setCalendarDate((prev) => addMonths(prev, 1));
  };

  const availableYears = generateIntegerArray(1900, 2099);
  const calendarYear = getYear(calendarDate);

  return (
    <div className={className}>
      <div className="flex items-center">
        <h2 className="flex flex-grow items-center gap-x-2 font-semibold text-gray-900">
          <span>{monthNames[getMonth(calendarDate)]}</span>
          <div className="relative">
            <Listbox
              value={calendarYear}
              onChange={(selectedYear) =>
                setCalendarDate((prev) =>
                  addYears(prev, selectedYear - calendarYear)
                )
              }
            >
              <Listbox.Button className="flex items-center gap-x-1 text-left focus:outline-0 focus:ring-0">
                {getYear(calendarDate)}
                <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
              </Listbox.Button>
              <Listbox.Options className="scrollbar-hide absolute mt-1 max-h-60 w-full overflow-x-hidden overflow-y-scroll rounded-md bg-white py-1 shadow">
                {availableYears.map((year) => (
                  <Listbox.Option
                    className="cursor-pointer py-1 pl-1.5 transition duration-300 hover:bg-gray-100"
                    key={year}
                    value={year}
                  >
                    {year}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Listbox>
          </div>
        </h2>
        <button
          type="button"
          onClick={() => goToPreviousMonth()}
          className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
        >
          <span className="sr-only">Mês Anterior</span>
          <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => goToNextMonth()}
          className="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
        >
          <span className="sr-only">Próximo Mês</span>
          <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
      <div className="mt-10 grid grid-cols-7 text-center text-xs leading-6 text-gray-500">
        {dayAbbreviations.map((dayAbbreviation) => (
          <div key={dayAbbreviation}>{dayAbbreviation}</div>
        ))}
      </div>
      <div className="mt-2 text-sm">
        {calendar.map((week, weekIdx) => (
          <div
            key={formatISO(week[0] ?? 0) + formatISO(week[1] ?? 0)}
            className={clsx(
              weekIdx > 0 && 'border-t border-gray-200',
              'grid grid-cols-7 py-2'
            )}
          >
            {week.map((day) => {
              const isToday = getIsToday(day);
              const isSelected = isSameDay(day, selectedDate);
              const isCurrentMonth = isSameMonth(day, calendarDate);

              return (
                <button
                  key={formatISO(day)}
                  type="button"
                  onClick={() => {
                    setSelectedDate(day);
                    if (onDateSelected) onDateSelected();
                  }}
                  className={cn(
                    isSelected && 'text-white',
                    !isSelected && isToday && 'text-primary-600',
                    !isSelected &&
                      !isToday &&
                      isCurrentMonth &&
                      'text-gray-900',
                    !isSelected &&
                      !isToday &&
                      !isCurrentMonth &&
                      'text-gray-400',
                    isSelected && 'bg-primary-600',
                    !isSelected && 'hover:bg-gray-200',
                    (isSelected || isToday) && 'font-semibold',
                    'mx-auto flex h-8 w-8 items-center justify-center rounded-full'
                  )}
                >
                  {getDate(day)}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
