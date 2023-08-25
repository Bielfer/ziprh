"use client";
import { useState, type FC, useMemo } from "react";
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
import CalendarMonthView from "~/components/calendar-month-view";
import { FingerPrintIcon } from "@heroicons/react/24/outline";
import FeedIcons from "~/components/feed-icons";
import EmptyState from "~/components/empty-state";
import { ClockIcon } from "@heroicons/react/20/solid";
import TabsWrapper from "../tabs-wrapper";

type Props = {
  userId: string;
};

const CalendarWrapper: FC<Props> = ({ userId }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isFormClockInOpen, setIsFormClockInOpen] = useState(false);
  const startDate = startOfMonth(selectedDate);
  const endDate = endOfMonth(selectedDate);
  const { data: clockIns, isLoading } = trpc.clockIns.getMany.useQuery({
    userId,
    startDate,
    endDate,
  });
  const { data: hoursWorked, isLoading: isLoadingHoursWorked } =
    trpc.clockIns.employeesHoursWorked.useQuery({ userId, startDate, endDate });

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

  const filteredClockIns = useMemo(
    () =>
      clockIns
        ?.filter((clockIn) => isSameDay(clockIn.punchTime, selectedDate))
        .map((clockIn, idx) => ({
          id: clockIn.id,
          content: `Ponto ${idx + 1} batido`,
          date: format(clockIn.punchTime, "H:mm"),
          icon: FingerPrintIcon,
          iconBackground: "bg-primary-600",
        })) ?? [],
    [clockIns, selectedDate]
  );

  return (
    <>
      <div className="my-4 flex items-center text-sm text-gray-500">
        <ClockIcon
          className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
          aria-hidden="true"
        />
        {isLoadingHoursWorked ? 0 : hoursWorked?.[userId] ?? 0} horas no mês
      </div>
      <TabsWrapper className="py-0" />
      <LoadingWrapper className="py-10" isLoading={isLoading}>
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
        className="w-full max-w-sm"
      >
        <h2 className="mb-6">Pontos em {format(selectedDate, "dd/MM")}</h2>
        {filteredClockIns.length > 0 ? (
          <div className="flex flex-col items-center">
            <FeedIcons items={filteredClockIns} className="mb-10 w-full" />
          </div>
        ) : (
          <EmptyState
            icon={FingerPrintIcon}
            title="Você não bateu o ponto nesse dia"
            subtitle="Se você acha que estão faltando pontos, basta falar com o administrador da sua organização"
          />
        )}
      </Modal>
    </>
  );
};

export default CalendarWrapper;
