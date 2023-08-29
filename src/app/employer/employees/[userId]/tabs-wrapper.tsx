import type { FC } from "react";
import Tabs from "~/components/tabs";
import { paths } from "~/constants/paths";

type Props = {
  userId: string;
  employeeName: string;
};

const TabsWrapper: FC<Props> = ({ userId, employeeName }) => {
  return (
    <Tabs
      className="mb-8"
      items={[
        {
          name: "Escala",
          href: {
            pathname: paths.employerEmployeesByUserIdSchedule(userId),
            query: { employeeName },
          },
        },
        {
          name: "Folgas",
          href: {
            pathname: paths.employerEmployeesByUserIdDaysOff(userId),
            query: { employeeName },
          },
        },
      ]}
    />
  );
};

export default TabsWrapper;
