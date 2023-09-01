import { type OrganizationMembershipResource } from "@clerk/types";
import { CalendarDaysIcon, PencilSquareIcon } from "@heroicons/react/20/solid";
import { type DayOffType } from "@prisma/client";
import { endOfDay, startOfDay } from "date-fns";
import { useState, type FC } from "react";
import Button from "~/components/button";
import EmptyState from "~/components/empty-state";
import LoadingWrapper from "~/components/loading-wrapper";
import MyLink from "~/components/my-link";
import StackedList from "~/components/stacked-list";
import { useToast } from "~/components/toast";
import { dayOffTypes } from "~/constants/days-off-types";
import { paths } from "~/constants/paths";
import { tryCatch } from "~/helpers/try-catch";
import { trpc } from "~/services/trpc";

type Employee = {
  id: string;
  name: string;
  imageUrl: string;
  isWorkDay: boolean;
  times: string[] | undefined;
  dayOff:
    | {
        id: number;
        date: Date;
        type: DayOffType;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        organizationId: string;
      }
    | undefined;
};

type Props = {
  date: Date;
  membershipList?: OrganizationMembershipResource[] | null;
};

const EmployeesAvailable: FC<Props> = ({ date, membershipList }) => {
  const { addToast } = useToast();
  const {
    data: schedules,
    refetch: refetchSchedules,
    isLoading,
  } = trpc.schedules.getFormattedSchedule.useQuery(
    {
      userId:
        membershipList?.map((member) => member.publicUserData.userId ?? "") ??
        [],
      startDate: startOfDay(date),
      endDate: endOfDay(date),
    },
    { enabled: !!membershipList }
  );
  const { mutateAsync: createDayOff } = trpc.dayOff.create.useMutation();
  const { mutateAsync: updateDayOff } = trpc.dayOff.update.useMutation();
  const [loadingEmployees, setLoadingEmployees] = useState<string[]>([]);

  const dailySchedule = schedules?.[0];

  const addLoadingEmployee = (employeeId: string) => {
    setLoadingEmployees((prev) => [...prev, employeeId]);
  };

  const removeLoadingEmployee = (employeeId: string) => {
    setLoadingEmployees((prev) =>
      prev.filter((loadingId) => loadingId !== employeeId)
    );
  };

  const handleGiveDayOff = async (employee: Employee) => {
    addLoadingEmployee(employee.id);

    let error: any;

    if (!!employee.dayOff?.id)
      [, error] = await tryCatch(
        updateDayOff({
          id: employee.dayOff.id,
          type: dayOffTypes.dayOff,
        })
      );
    else
      [, error] = await tryCatch(
        createDayOff({
          date,
          userId: employee.id,
        })
      );

    if (error) {
      addToast({
        type: "error",
        content: "Falha ao dar folga, tente novamente ao sumir essa mensagem",
        duration: 5000,
      });
      return;
    }

    refetchSchedules();
    removeLoadingEmployee(employee.id);
  };

  const handleRemoveDayOff = async (employee: Employee) => {
    addLoadingEmployee(employee.id);

    let error: any;

    if (!!employee.dayOff)
      [, error] = await tryCatch(
        updateDayOff({
          id: employee.dayOff.id,
          type: dayOffTypes.workDay,
        })
      );
    else
      [, error] = await tryCatch(
        createDayOff({
          date,
          userId: employee.id,
          type: dayOffTypes.workDay,
        })
      );

    if (error) {
      addToast({
        type: "error",
        content:
          "Falha ao retirar folga, tente novamente ao sumir essa mensagem",
        duration: 5000,
      });
      return;
    }

    refetchSchedules();
    removeLoadingEmployee(employee.id);
  };

  return (
    <LoadingWrapper isLoading={isLoading}>
      {!!dailySchedule ? (
        <StackedList
          items={dailySchedule.employees.map((employee) => ({
            id: employee.id,
            imageUrl: employee.imageUrl,
            name: employee.name,
            subName: (employee.times ?? [])?.join(" / ") || "N. Inf.",
            onRight: employee.isWorkDay ? (
              <Button
                variant="secondary"
                size="xs"
                loading={loadingEmployees.includes(employee.id)}
                onClick={() => handleGiveDayOff(employee)}
              >
                Dar Folga
              </Button>
            ) : (
              <Button
                variant="danger"
                size="xs"
                loading={loadingEmployees.includes(employee.id)}
                onClick={() => handleRemoveDayOff(employee)}
              >
                Remover Folga
              </Button>
            ),
          }))}
        />
      ) : (
        <EmptyState
          className="pt-5"
          icon={CalendarDaysIcon}
          title="Você não possui nenhum funcionário em escala nesse dia"
          subtitle="Para mudar isso basta ir na aba de funcionários, clicando abaixo"
          buttonOrLink={
            <MyLink
              href={paths.employerEmployees}
              iconLeft={PencilSquareIcon}
              variant="button-primary"
            >
              Alterar Escala
            </MyLink>
          }
        />
      )}
    </LoadingWrapper>
  );
};

export default EmployeesAvailable;
