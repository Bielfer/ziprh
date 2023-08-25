"use client";
import { useState, type FC } from "react";
import { trpc } from "~/services/trpc";
import { generateMonth } from "~/helpers/dates";
import {
  addMonths,
  endOfMonth,
  format,
  isSameDay,
  startOfMonth,
} from "date-fns";
import LoadingWrapper from "~/components/loading-wrapper";
import Modal from "~/components/modal";
import FormClockIn from "~/components/forms/clock-in";
import CalendarMonthView from "~/components/calendar-month-view";
import { ClockIcon } from "@heroicons/react/20/solid";

type Props = {
  userId: string;
};

const CalendarWrapper: FC<Props> = ({ userId }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isFormClockInOpen, setIsFormClockInOpen] = useState(false);
  const startDate = startOfMonth(selectedDate);
  const endDate = endOfMonth(selectedDate);
  const {
    data: clockIns,
    isLoading: isLoadingClockIns,
    refetch,
  } = trpc.clockIns.getMany.useQuery({
    userId,
    startDate,
    endDate,
  });
  const { data: hoursWorked, isLoading: isLoadingHoursWorked } =
    trpc.clockIns.employeesHoursWorked.useQuery({ startDate, endDate, userId });

  const days = generateMonth(selectedDate).map((day) => ({
    time: day,
    events:
      clockIns
        ?.filter((clockIn) => isSameDay(clockIn.punchTime, day))
        .map((item, idx) => ({
          time: format(item.punchTime, "H:mm"),
          name: `Ponto ${idx + 1}`,
        })) ?? [],
  }));

  const goToNextMonth = () => {
    setSelectedDate((prev) => addMonths(prev, 1));
  };

  const goToPreviousMonth = () => {
    setSelectedDate((prev) => addMonths(prev, -1));
  };

  return (
    <>
      <div className="mt-2 flex items-center text-sm text-gray-500">
        <ClockIcon
          className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
          aria-hidden="true"
        />
        {isLoadingHoursWorked ? 0 : hoursWorked?.[userId] ?? 0} horas no mês
      </div>

      <LoadingWrapper className="py-10" isLoading={isLoadingClockIns}>
        <CalendarMonthView
          date={selectedDate}
          days={days}
          onDayClick={(day) => {
            setIsFormClockInOpen(true);
            setSelectedDate(day);
          }}
          goToNextMonth={goToNextMonth}
          goToPreviousMonth={goToPreviousMonth}
          exceedingMessage="pontos"
        />
      </LoadingWrapper>
      <Modal
        isOpen={isFormClockInOpen}
        onClose={() => setIsFormClockInOpen(false)}
      >
        <FormClockIn
          className="max-w-sm"
          date={selectedDate}
          afterSubmit={() => {
            setIsFormClockInOpen(false);
            refetch();
          }}
        />
      </Modal>
    </>
  );
};

export default CalendarWrapper;
