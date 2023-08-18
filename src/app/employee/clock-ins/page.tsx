import { type Metadata } from "next";
import { type FC } from "react";

export const metadata: Metadata = {
  title: "Seus Pontos | ZipRH",
  description: "Acompanhe os pontos que você bateu nesse mês",
};

const EmployeeClockIns: FC = () => {
  return (
    <>
      <h1>Pontos Batidos</h1>
    </>
  );
};

export default EmployeeClockIns;
