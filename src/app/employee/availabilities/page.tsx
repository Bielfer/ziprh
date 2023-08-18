import { type Metadata } from "next";
import { type FC } from "react";

export const metadata: Metadata = {
  title: "Sua Escala | ZipRH",
  description: "Acompanhe seus horários de trabalho no mês",
};

const EmployeeAvailabilities: FC = () => {
  return (
    <>
      <h1>Sua Escala</h1>
    </>
  );
};

export default EmployeeAvailabilities;
