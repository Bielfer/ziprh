"use client";
import { useState, type FC, useMemo } from "react";
import { trpc } from "~/services/trpc";
import { generateMonth } from "~/helpers/dates";
import {
  addMonths,
  endOfMonth,
  format,
  getDay,
  isSameDay,
  startOfMonth,
} from "date-fns";
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
  const [isDaysOffOpen, setIsDaysOffOpen] = useState(false);
  const {
    data: schedules,
    isLoading,
    refetch: refetchSchedules,
  } = trpc.schedules.getMany.useQuery({ userId });
  useOrganizationChange(refetchSchedules);
  const { data: daysOff } = trpc.dayOff.getMany.useQuery({
    startDate: startOfMonth(selectedDate),
    endDate: endOfMonth(selectedDate),
  });

  const days = useMemo(
    () =>
      generateMonth(selectedDate).map((day) => {
        const filteredSchedules = schedules?.filter(
          (schedule) =>
            schedule.days.includes(getDay(day)) &&
            !daysOff?.find(
              (dayOff) =>
                isSameDay(dayOff.date, day) && dayOff.userId === schedule.userId
            )
        );
        const events: { name: string; time: string }[] = [];

        filteredSchedules?.forEach((schedule, idx) => {
          events.push({
            name: `Horário ${idx + 1}`,
            time: `${schedule.beginning}-${schedule.end}`,
          });
        });

        return {
          time: day,
          events,
        };
      }),
    [selectedDate, schedules, daysOff]
  );

  const dayEvents = days
    .find((item) => isSameDay(item.time, selectedDate))
    ?.events.map((item, idx) => ({
      id: idx,
      icon: ClockIcon,
      iconBackground: "bg-primary-600",
      content: `Horário ${idx + 1}`,
      date: item.time.split("-").join(" - "),
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
