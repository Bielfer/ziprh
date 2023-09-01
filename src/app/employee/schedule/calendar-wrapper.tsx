"use client";
import { useState, type FC, useMemo } from "react";
import { trpc } from "~/services/trpc";
import { startAndEndOfCalendarMonth } from "~/helpers/dates";
import { addMonths, format, isSameDay } from "date-fns";
import LoadingWrapper from "~/components/loading-wrapper";
import Modal from "~/components/modal";
import CalendarMonthView from "~/components/calendar-month-view";
import EmptyState from "~/components/empty-state";
import {
  CalendarDaysIcon,
  CalendarIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { useOrganizationChange } from "~/hooks";
import FeedIcons from "~/components/feed-icons";

type Props = {
  userId: string;
};

const CalendarWrapper: FC<Props> = ({ userId }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { firstDayOfMonth, lastDayOfMonth } =
    startAndEndOfCalendarMonth(selectedDate);
  const [isDaysOffOpen, setIsDaysOffOpen] = useState(false);
  const {
    data: schedules,
    refetch: refetchSchedules,
    isLoading,
  } = trpc.schedules.getFormattedSchedule.useQuery({
    userId: [userId],
    startDate: firstDayOfMonth,
    endDate: lastDayOfMonth,
  });
  useOrganizationChange(refetchSchedules);

  const days = useMemo(
    () =>
      schedules?.map((schedule) => ({
        time: schedule.day,
        events: schedule.employees
          .filter((employee) => employee.isWorkDay)
          .map((employee) => ({
            name: employee.name,
            time: (employee.times ?? []).join(" / ") || "N. Inf.",
          })),
      })) ?? [],
    [schedules]
  );

  const dayEvents = days
    .find((item) => isSameDay(item.time, selectedDate))
    ?.events.map((item, idx) => ({
      id: idx,
      icon: ClockIcon,
      iconBackground: "bg-primary-600",
      content: `Horário ${idx + 1}`,
      date: item.time,
    }));

  const goToNextMonth = () => {
    setSelectedDate((prev) => addMonths(prev, 1));
  };

  const goToPreviousMonth = () => {
    setSelectedDate((prev) => addMonths(prev, -1));
  };

  return (
    <>
      <LoadingWrapper className="py-10" isLoading={isLoading}>
        {schedules && schedules.length > 0 ? (
          <CalendarMonthView
            date={selectedDate}
            days={days}
            onDayClick={(day) => {
              setIsDaysOffOpen(true);
              setSelectedDate(day);
            }}
            goToNextMonth={goToNextMonth}
            goToPreviousMonth={goToPreviousMonth}
            exceedingMessage="horários"
          />
        ) : (
          <EmptyState
            className="mt-10"
            icon={CalendarDaysIcon}
            title="Você ainda não possui uma escala"
            subtitle="Para criar a sua primeira escala basta falar com seu supervisor"
          />
        )}
      </LoadingWrapper>
      <Modal
        isOpen={isDaysOffOpen}
        onClose={() => setIsDaysOffOpen(false)}
        className="w-full max-w-md"
      >
        <h3 className="pb-6">Minha escala {format(selectedDate, "dd/MM")}</h3>
        {!!dayEvents && dayEvents.length > 0 ? (
          <FeedIcons items={dayEvents ?? []} />
        ) : (
          <EmptyState
            icon={CalendarIcon}
            title="Você não possui horários nesse dia"
            subtitle="Caso ache que tem algo de errado, basta falar com seu supervisor"
          />
        )}
      </Modal>
    </>
  );
};

export default CalendarWrapper;
