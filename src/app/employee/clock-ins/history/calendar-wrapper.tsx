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

type Props = {
  userId: string;
};

const CalendarWrapper: FC<Props> = ({ userId }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isFormClockInOpen, setIsFormClockInOpen] = useState(false);
  const { data: clockIns, isLoading } = trpc.clockIns.getMany.useQuery({
    userId,
    startDate: startOfMonth(selectedDate),
    endDate: endOfMonth(selectedDate),
  });

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
