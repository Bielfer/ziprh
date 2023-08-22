import { endOfDay, startOfDay } from "date-fns";
import type { FC } from "react";
import Button from "~/components/button";
import LoadingWrapper from "~/components/loading-wrapper";
import StackedList from "~/components/stacked-list";
import { useToast } from "~/components/toast";
import { tryCatch } from "~/helpers/try-catch";
import { trpc } from "~/services/trpc";

type Props = {
  date: Date;
  refetchDaysOff: () => void;
  employeeSchedules: {
    employeeId: string;
    employeeName: string;
    schedule: string;
    employeeImageUrl: string;
  }[];
};

const EmployeesAvailable: FC<Props> = ({
  employeeSchedules,
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
  const { mutateAsync: createDayOff, isLoading: isCreatingDayOff } =
    trpc.dayOff.create.useMutation();
  const { mutateAsync: deleteDayOff, isLoading: isDeletingDayOff } =
    trpc.dayOff.delete.useMutation();

  return (
    <LoadingWrapper isLoading={isLoading}>
      <StackedList
        items={employeeSchedules.map((employeeSchedule) => ({
          id: employeeSchedule.employeeId,
          imageUrl: employeeSchedule.employeeImageUrl,
          name: employeeSchedule.employeeName,
          subName: employeeSchedule.schedule,
          onRight: !daysOff?.find(
            (dayOff) => dayOff.userId === employeeSchedule.employeeId
          ) ? (
            <Button
              variant="secondary"
              size="xs"
              loading={isCreatingDayOff}
              disabled={isCreatingDayOff}
              onClick={async () => {
                const [, error] = await tryCatch(
                  createDayOff({
                    date,
                    userId: employeeSchedule.employeeId,
                  })
                );
                if (error) {
                  addToast({
                    type: "error",
                    content:
                      "Falha ao dar folga, tente novamente ao sumir essa mensagem",
                    duration: 5000,
                  });
                  return;
                }

                refetch();
                refetchDaysOff();
              }}
            >
              Dar Folga
            </Button>
          ) : (
            <Button
              variant="danger"
              size="xs"
              loading={isDeletingDayOff}
              disabled={isDeletingDayOff}
              onClick={async () => {
                const id = daysOff.find(
                  (dayOff) => dayOff.userId === employeeSchedule.employeeId
                )?.id as number;
                const [, error] = await tryCatch(deleteDayOff({ id }));

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
              }}
            >
              Remover Folga
            </Button>
          ),
        }))}
      />
    </LoadingWrapper>
  );
};

export default EmployeesAvailable;
