"use client";
import {
  CalendarIcon,
  FingerPrintIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import type { FC, ReactNode } from "react";
import Sidebar from "~/components/sidebar";
import { paths } from "~/constants/paths";

const items = [
  { name: "Escala", href: paths.employerSchedule, icon: CalendarIcon },
  { name: "Pontos", href: paths.employerClockIns, icon: FingerPrintIcon },
  { name: "Funcionários", href: paths.employerEmployees, icon: UsersIcon },
];

type Props = {
  children: ReactNode;
};

const SidebarWrapper: FC<Props> = ({ children }) => {
  return <Sidebar items={items}>{children}</Sidebar>;
};

export default SidebarWrapper;
