"use client";
import type { FC } from "react";
import EmployeesList from "../employees-list";
import { paths } from "~/constants/paths";

const EmployeesListWrapper: FC = () => {
  return (
    <EmployeesList
      href={(userId) => paths.employerAvailabilitiesByUserId(userId)}
    />
  );
};

export default EmployeesListWrapper;
