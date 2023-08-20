import { type Metadata } from "next";
import { type FC } from "react";
import EmployeesListWrapper from "./employees-list-wrapper";

export const metadata: Metadata = {
  title: "Seus Funcionários | ZipRH",
  description: "Veja uma lista com todos os seus funcionários",
};

const EmployerEmployeesPage: FC = () => {
  return (
    <>
      <h1>Funcionários</h1>
      <EmployeesListWrapper />
    </>
  );
};

export default EmployerEmployeesPage;
