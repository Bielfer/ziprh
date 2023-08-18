"use client";
import type { FC } from "react";
import { trpc } from "~/services/trpc";
import Calendar from "./calendar";
import { generateMonth } from "~/helpers/dates";
import { isSameDay } from "date-fns";
import LoadingWrapper from "~/components/loading-wrapper";

type Props = {
  userId: string;
};

const CalendarWrapper: FC<Props> = ({ userId }) => {
  const { data: clockIns, isLoading } = trpc.clockIns.getMany.useQuery({
    userId,
  });

  const days = generateMonth(new Date()).map((day) => ({
    time: day,
    events:
      clockIns
        ?.filter((clockIn) => isSameDay(clockIn.punchTime, day))
        .map((item, idx) => ({
          time: item.punchTime,
          name: `Ponto ${idx + 1}`,
        })) ?? [],
  }));

  return (
    <LoadingWrapper className="py-10" isLoading={isLoading}>
      <Calendar days={days} />
    </LoadingWrapper>
  );
};

export default CalendarWrapper;
