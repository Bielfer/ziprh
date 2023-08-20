import type { FC } from "react";
import EmployeesListWrapper from "./employees-list-wrapper";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Escala dos Funcionários | ZipRH",
  description:
    "Uma lista completa de todos os seus funcionários, em que você pode acessar a escala de cada um",
};

const EmployerAvailabilities: FC = () => {
  return (
    <>
      <h1>Escala</h1>
      <EmployeesListWrapper />
    </>
  );
};

export default EmployerAvailabilities;
