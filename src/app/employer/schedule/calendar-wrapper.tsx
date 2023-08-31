"use client";
import { useState, type FC, useMemo } from "react";
import { trpc } from "~/services/trpc";
import { generateMonth, isIntervalSchedule } from "~/helpers/dates";
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
import EmployeesAvailable, {
  type EmployeeSchedule,
} from "./employees-available";
import EmptyState from "~/components/empty-state";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import MyLink from "~/components/my-link";
import { paths } from "~/constants/paths";
import { PlusIcon } from "@heroicons/react/20/solid";
import { useOrganizationChange } from "~/hooks";
import { scheduleTypes } from "~/constants/schedule-types";
import { dayOffTypes } from "~/constants/days-off-types";

const CalendarWrapper: FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isDaysOffOpen, setIsDaysOffOpen] = useState(false);
  const {
    data: schedules,
    isLoading,
    refetch: refetchSchedules,
  } = trpc.schedules.getMany.useQuery({});
  useOrganizationChange(refetchSchedules);
  const { data: daysOff, refetch: refetchDaysOff } =
    trpc.dayOff.getMany.useQuery({
      startDate: startOfMonth(selectedDate),
      endDate: endOfMonth(selectedDate),
    });

  const days = useMemo(
    () =>
      generateMonth(selectedDate).map((day) => {
        const filteredSchedules = schedules?.filter((schedule) => {
          const foundDayOff = daysOff?.find(
            (dayOff) =>
              isSameDay(dayOff.date, day) && dayOff.userId === schedule.userId
          );

          if (foundDayOff?.type === dayOffTypes.workDay) return true;

          return (
            (schedule.type === scheduleTypes.customizable
              ? schedule.days.includes(getDay(day))
              : isIntervalSchedule({
                  dateLeft: schedule.firstDayOff,
                  dateRight: day,
                  daysOff: schedule.daysOff,
                  daysWorked: schedule.daysWorked,
                })) && foundDayOff?.type !== dayOffTypes.dayOff
          );
        });
        const events: { name: string; time: string }[] = [];
        let amountOfTimes = 0;

        filteredSchedules?.forEach((schedule, idx) => {
          const foundIdx = filteredSchedules.findIndex(
            (employeeSchedule) => employeeSchedule.userId === schedule.userId
          );
          const existingSchedule = events[foundIdx];

          if (!!existingSchedule) {
            amountOfTimes++;

            if (idx === filteredSchedules.length - 1 && amountOfTimes > 0) {
              existingSchedule.time += ` + ${amountOfTimes}`;
            }

            return;
          }

          events.push({
            name: schedule.userFullName,
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

  const goToNextMonth = () => {
    setSelectedDate((prev) => addMonths(prev, 1));
  };

  const goToPreviousMonth = () => {
    setSelectedDate((prev) => addMonths(prev, -1));
  };

  const schedulesByDay = useMemo(() => {
    const employeeSchedules: EmployeeSchedule[] = [];

    schedules?.forEach((schedule) => {
      const foundIdx = employeeSchedules.findIndex(
        (employeeSchedule) => employeeSchedule.employeeId === schedule.userId
      );
      const existingSchedule = employeeSchedules[foundIdx];

      if (!!existingSchedule) {
        existingSchedule.schedule += ` / ${schedule.beginning} - ${schedule.end}`;
        return;
      }

      employeeSchedules.push({
        employeeId: schedule.userId,
        employeeImageUrl: schedule.userImage ?? "",
        employeeName: schedule.userFullName ?? null,
        schedule: `${schedule.beginning} - ${schedule.end}`,
        isWorkDay:
          schedule.type === scheduleTypes.customizable
            ? schedule.days.includes(getDay(selectedDate))
            : isIntervalSchedule({
                dateLeft: schedule.firstDayOff,
                dateRight: selectedDate,
                daysOff: schedule.daysOff,
                daysWorked: schedule.daysWorked,
              }),
      });
    });

    return employeeSchedules;
  }, [selectedDate, schedules]);

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
            exceedingMessage="funcionários"
          />
        ) : (
          <EmptyState
            className="mt-10"
            icon={CalendarDaysIcon}
            title="Você ainda não fez a escala de nenhum funcionário"
            subtitle="Para criar a sua primeira escala basta clicar no botão abaixo"
            buttonOrLink={
              <MyLink
                href={paths.employerEmployees}
                variant="button-primary"
                iconLeft={PlusIcon}
              >
                Criar Escala
              </MyLink>
            }
          />
        )}
      </LoadingWrapper>
      <Modal
        isOpen={isDaysOffOpen}
        onClose={() => setIsDaysOffOpen(false)}
        className="w-full max-w-md"
      >
        <h3>Escala em {format(selectedDate, "dd/MM")}</h3>
        <EmployeesAvailable
          date={selectedDate}
          refetchDaysOff={() => refetchDaysOff()}
          schedulesByDay={schedulesByDay}
        />
      </Modal>
    </>
  );
};

export default CalendarWrapper;
