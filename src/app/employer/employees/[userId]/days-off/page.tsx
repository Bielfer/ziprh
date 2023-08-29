import { type FC } from "react";
import TabsWrapper from "../tabs-wrapper";
import FormDayOff from "~/components/forms/day-off";
import Container from "~/components/container";

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
    title: `Configurações de ${employeeName ?? "Funcionário sem Nome"} | ZipRH`,
    description: `Configure os dados de ${
      employeeName ?? "Funcionário sem Nome"
    }`,
  };
};

const EmployeeByIdDaysOff: FC<Props> = ({ params, searchParams }) => {
  const { userId } = params;
  const { employeeName } = searchParams;

  return (
    <>
      <h1>Folgas de {employeeName ?? "Funcionário sem nome"}</h1>
      <TabsWrapper
        userId={userId}
        employeeName={employeeName ?? "Funcionário sem nome"}
      />

      <Container smallerContainer smallerContainerSize="max-w-sm">
        <FormDayOff userId={userId} />
      </Container>
    </>
  );
};

export default EmployeeByIdDaysOff;
