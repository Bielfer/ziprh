import { type Metadata } from "next";
import type { FC } from "react";
import CalendarWrapper from "./calendar-wrapper";
import { auth } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Seus Pontos do Mês | ZipRH",
  description: "Acompanhe os pontos que você bateu nesse mês",
};

const EmployeeClockInsHistory: FC = () => {
  const { userId } = auth();

  return (
    <>
      <h1>Histórico de Pontos</h1>
      <CalendarWrapper userId={userId ?? ""} />
    </>
  );
};

export default EmployeeClockInsHistory;
