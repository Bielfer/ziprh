import type { FC } from "react";
import { type Metadata } from "next";
import CalendarWrapper from "./calendar-wrapper";

export const metadata: Metadata = {
  title: "Escala dos Funcionários | ZipRH",
  description: "Escala mensal de todos os funcionários",
};

const EmployerAvailabilities: FC = () => {
  return (
    <>
      <h1>Escala</h1>
      <CalendarWrapper />
    </>
  );
};

export default EmployerAvailabilities;
