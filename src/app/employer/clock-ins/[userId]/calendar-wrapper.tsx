"use client";
import { useState, type FC } from "react";
import { trpc } from "~/services/trpc";
import Calendar from "./calendar";
import { generateMonth } from "~/helpers/dates";
import { addMonths, endOfMonth, isSameDay, startOfMonth } from "date-fns";
import LoadingWrapper from "~/components/loading-wrapper";
import Modal from "~/components/modal";
import FormClockIn from "~/components/forms/clock-in";

type Props = {
  userId: string;
};

const CalendarWrapper: FC<Props> = ({ userId }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isFormClockInOpen, setIsFormClockInOpen] = useState(false);
  const {
    data: clockIns,
    isLoading,
    refetch,
  } = trpc.clockIns.getMany.useQuery({
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
          time: item.punchTime,
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
      <LoadingWrapper className="py-10" isLoading={isLoading}>
        <Calendar
          date={selectedDate}
          days={days}
          onDayClick={(day) => {
            setIsFormClockInOpen(true);
            setSelectedDate(day);
          }}
          goToNextMonth={goToNextMonth}
          goToPreviousMonth={goToPreviousMonth}
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
