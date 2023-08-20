import { type FC } from "react";

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
    title: `Escala de ${employeeName} | ZipRH`,
    description: `Veja a escala de ${employeeName} no período de um mês`,
  };
};

const AvailabilitiesByEmployee: FC<Props> = ({ params, searchParams }) => {
  const { employeeName } = searchParams;
  const { userId } = params;

  return (
    <>
      <h1>{employeeName}</h1>
    </>
  );
};

export default AvailabilitiesByEmployee;
