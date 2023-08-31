import { CalendarDaysIcon, PencilSquareIcon } from "@heroicons/react/20/solid";
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

export type EmployeeSchedule = {
  employeeId: string;
  employeeName: string;
  schedule: string;
  employeeImageUrl: string;
  isWorkDay: boolean;
};

type Props = {
  date: Date;
  refetchDaysOff: () => void;
  schedulesByDay: EmployeeSchedule[];
};

const EmployeesAvailable: FC<Props> = ({
  schedulesByDay,
  date,
  refetchDaysOff,
}) => {
  const { addToast } = useToast();
  const {
    data: daysOff,
    isLoading,
    refetch,
  } = trpc.dayOff.getMany.useQuery({
    startDate: startOfDay(date),
    endDate: endOfDay(date),
  });
  const { mutateAsync: createDayOff } = trpc.dayOff.create.useMutation();
  const { mutateAsync: updateDayOff } = trpc.dayOff.update.useMutation();
  const [loadingEmployees, setLoadingEmployees] = useState<string[]>([]);

  const addLoadingEmployee = (employeeId: string) => {
    setLoadingEmployees((prev) => [...prev, employeeId]);
  };

  const removeLoadingEmployee = (employeeId: string) => {
    setLoadingEmployees((prev) =>
      prev.filter((loadingId) => loadingId !== employeeId)
    );
  };

  const handleGiveDayOff = async (employeeSchedule: EmployeeSchedule) => {
    addLoadingEmployee(employeeSchedule.employeeId);

    let error: any;

    const dayOff = daysOff?.find(
      (dayOff) => dayOff.userId === employeeSchedule.employeeId
    );

    if (!!dayOff)
      [, error] = await tryCatch(
        updateDayOff({
          id: dayOff.id,
          type: dayOffTypes.dayOff,
        })
      );
    else
      [, error] = await tryCatch(
        createDayOff({
          date,
          userId: employeeSchedule.employeeId,
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

    refetch();
    refetchDaysOff();
    removeLoadingEmployee(employeeSchedule.employeeId);
  };

  const handleRemoveDayOff = async (employeeSchedule: EmployeeSchedule) => {
    addLoadingEmployee(employeeSchedule.employeeId);

    let error: any;
    const dayOff = daysOff?.find(
      (dayOff) => dayOff.userId === employeeSchedule.employeeId
    );

    if (!!dayOff)
      [, error] = await tryCatch(
        updateDayOff({
          id: dayOff.id,
          type: dayOffTypes.workDay,
        })
      );
    else
      [, error] = await tryCatch(
        createDayOff({
          date,
          userId: employeeSchedule.employeeId,
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

    refetch();
    refetchDaysOff();
    removeLoadingEmployee(employeeSchedule.employeeId);
  };

  return (
    <LoadingWrapper isLoading={isLoading}>
      {schedulesByDay.length > 0 ? (
        <StackedList
          items={schedulesByDay.map((employeeSchedule) => {
            const foundDayOff = daysOff?.find(
              (dayOff) => dayOff.userId === employeeSchedule.employeeId
            );

            return {
              id: employeeSchedule.employeeId,
              imageUrl: employeeSchedule.employeeImageUrl,
              name: employeeSchedule.employeeName ?? "Funcionário sem nome",
              subName: employeeSchedule.schedule,
              onRight:
                foundDayOff?.type === dayOffTypes.dayOff ||
                (!foundDayOff && !employeeSchedule.isWorkDay) ? (
                  <Button
                    variant="danger"
                    size="xs"
                    loading={loadingEmployees.includes(
                      employeeSchedule.employeeId
                    )}
                    onClick={() => handleRemoveDayOff(employeeSchedule)}
                  >
                    Remover Folga
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    size="xs"
                    loading={loadingEmployees.includes(
                      employeeSchedule.employeeId
                    )}
                    onClick={() => handleGiveDayOff(employeeSchedule)}
                  >
                    Dar Folga
                  </Button>
                ),
            };
          })}
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
