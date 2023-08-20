"use client";
import type { FC } from "react";
import Tabs from "~/components/tabs";
import { paths } from "~/constants/paths";
import cn from "~/helpers/cn";

const items = [
  {
    href: paths.employeeClockIns,
    name: "Hoje",
  },
  {
    href: paths.employeeClockInsHistory,
    name: "Histórico",
  },
];

type Props = {
  className?: string;
};

const TabsWrapper: FC<Props> = ({ className }) => {
  return <Tabs items={items} className={cn("pb-10 pt-4", className)} />;
};

export default TabsWrapper;
