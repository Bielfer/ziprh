import type { FC } from "react";
import { type Metadata } from "next";
import EmployeesListWrapper from "./employees-list-wrapper";

export const metadata: Metadata = {
  title: "Pontos dos Funcionários | ZipRH",
  description:
    "Uma lista completa de todos os seus funcionários, em que você pode acessar os pontos batidos por cada um",
};

const EmployerClockIns: FC = () => {
  return (
    <>
      <h1>Pontos</h1>
      <EmployeesListWrapper />
    </>
  );
};

export default EmployerClockIns;
