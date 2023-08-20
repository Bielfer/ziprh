import { type Metadata } from "next";
import type { FC } from "react";
import TabsWrapper from "../tabs-wrapper";

export const metadata: Metadata = {
  title: "Seus Pontos do Mês | ZipRH",
  description: "Acompanhe os pontos que você bateu nesse mês",
};

const EmployeeClockInsHistory: FC = () => {
  return (
    <>
      <h1>Histórico de Pontos</h1>
      <TabsWrapper />
    </>
  );
};

export default EmployeeClockInsHistory;
