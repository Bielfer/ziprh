import type { FC } from "react";
import CalendarWrapper from "./calendar-wrapper";

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
    title: `Pontos batidos por ${
      employeeName ?? "Funcionário sem Nome"
    } | ZipRH`,
    description: `Veja todos os pontos que foram batidos por ${
      employeeName ?? "Funcionário sem Nome"
    } no período de um mês`,
  };
};

const ClockInByEmployee: FC<Props> = ({ searchParams, params }) => {
  const { employeeName } = searchParams;
  const { userId } = params;

  return (
    <>
      <h1>{employeeName ?? "Funcionário sem Nome"}</h1>
      <CalendarWrapper userId={userId} />
    </>
  );
};

export default ClockInByEmployee;
