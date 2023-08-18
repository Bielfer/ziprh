import type { FC } from "react";
import Calendar from "./calendar";

type Props = {
  params: {
    userId: string;
  };
  searchParams: {
    employeeName?: string;
  };
};

export const generateMetadata = ({ searchParams }: Props) => {
  const { employeeName } = searchParams;

  return {
    title: `Pontos batidos por ${employeeName} | ZipRH`,
    description: `Veja todos os pontos que foram batidos por ${employeeName} no período de um mês`,
  };
};

const ClockInByEmployee: FC<Props> = ({ searchParams }) => {
  const { employeeName } = searchParams;

  return (
    <>
      <h1>{employeeName}</h1>
      <Calendar />
    </>
  );
};

export default ClockInByEmployee;
