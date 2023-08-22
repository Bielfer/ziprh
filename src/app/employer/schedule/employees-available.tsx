import type { FC } from "react";
import Button from "~/components/button";
import StackedList from "~/components/stacked-list";

type Props = {
  employeeSchedules: {
    employeeId: string;
    employeeName: string;
    schedule: string;
    employeeImageUrl: string;
  }[];
};

const EmployeesAvailable: FC<Props> = ({ employeeSchedules }) => {
  return (
    <StackedList
      items={employeeSchedules.map((item) => ({
        id: item.employeeId,
        imageUrl: item.employeeImageUrl,
        name: item.employeeName,
        subName: item.schedule,
        onRight: (
          <Button variant="secondary" size="xs">
            Dar Folga
          </Button>
        ),
      }))}
    />
  );
};

export default EmployeesAvailable;
