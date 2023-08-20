"use client";
import type { FC } from "react";
import Tabs from "~/components/tabs";
import { paths } from "~/constants/paths";

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

const TabsWrapper: FC = () => {
  return <Tabs items={items} className="pb-10 pt-4" />;
};

export default TabsWrapper;
