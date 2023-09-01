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
      className="mb-8 mt-4 sm:mt-0"
      items={[
        {
          name: "Escala",
          href: {
            pathname: paths.employerEmployeesByUserIdSchedule(userId),
            query: { employeeName },
          },
        },
      ]}
    />
  );
};

export default TabsWrapper;
