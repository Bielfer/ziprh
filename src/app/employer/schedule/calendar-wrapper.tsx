"use client";
import { useState, type FC, useMemo } from "react";
import { trpc } from "~/services/trpc";
import { addMonths, format } from "date-fns";
import LoadingWrapper from "~/components/loading-wrapper";
import Modal from "~/components/modal";
import CalendarMonthView from "~/components/calendar-month-view";
import EmployeesAvailable from "./employees-available";
import EmptyState from "~/components/empty-state";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import MyLink from "~/components/my-link";
import { paths } from "~/constants/paths";
import { PlusIcon } from "@heroicons/react/20/solid";
import { useOrganizationChange } from "~/hooks";
import { useOrganization } from "@clerk/nextjs";
import { roles } from "~/constants/roles";
import { startAndEndOfCalendarMonth } from "~/helpers/dates";

const CalendarWrapper: FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { firstDayOfMonth, lastDayOfMonth } =
    startAndEndOfCalendarMonth(selectedDate);
  const [isDaysOffOpen, setIsDaysOffOpen] = useState(false);
  const { membershipList } = useOrganization({
    membershipList: { limit: 20, role: [roles.basicMember] },
  });
  const {
    data: schedules,
    refetch: refetchSchedules,
    isLoading,
  } = trpc.schedules.getFormattedSchedule.useQuery(
    {
      userId:
        membershipList?.map((member) => member.publicUserData.userId ?? "") ??
        [],
      startDate: firstDayOfMonth,
      endDate: lastDayOfMonth,
    },
    { enabled: !!membershipList }
  );
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
        onClose={() => {
          setIsDaysOffOpen(false);
          refetchSchedules();
        }}
        className="w-full max-w-md"
      >
        <h3>Escala em {format(selectedDate, "dd/MM")}</h3>
        <EmployeesAvailable
          date={selectedDate}
          membershipList={membershipList}
        />
      </Modal>
    </>
  );
};

export default CalendarWrapper;
