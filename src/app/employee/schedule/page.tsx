import { type Metadata } from "next";
import { type FC } from "react";
import CalendarWrapper from "./calendar-wrapper";

export const metadata: Metadata = {
  title: "Sua Escala | ZipRH",
  description: "Acompanhe seus horários de trabalho no mês",
};

const EmployeeAvailabilities: FC = () => {
  return (
    <>
      <h1>Sua Escala</h1>
      <CalendarWrapper />
    </>
  );
};

export default EmployeeAvailabilities;
