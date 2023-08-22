import { type FC } from "react";
import Container from "~/components/container";
import FormEmployeeSchedule from "~/components/forms/employee-schedule";

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
    title: `Configurações de ${employeeName} | ZipRH`,
    description: `Configure os dados de ${employeeName}`,
  };
};

const EmployerEmployeeByUserId: FC<Props> = ({ params, searchParams }) => {
  const { userId } = params;
  const { employeeName } = searchParams;

  return (
    <>
      <h1>Configurações de {employeeName}</h1>
      <Container smallerContainer className="pt-8">
        <FormEmployeeSchedule employeeId={userId} />
      </Container>
    </>
  );
};

export default EmployerEmployeeByUserId;