import { type FC } from "react";
import FormEmployeeSchedule from "~/components/forms/employee-schedule";
import TabsWrapper from "../tabs-wrapper";

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
    title: `Escala de ${employeeName ?? "Funcionário sem Nome"} | ZipRH`,
    description: `Configure a escala de ${
      employeeName ?? "Funcionário sem Nome"
    }`,
  };
};

const EmployerEmployeeByUserId: FC<Props> = ({ params, searchParams }) => {
  const { userId } = params;
  const { employeeName } = searchParams;

  return (
    <>
      <h1>Escala de {employeeName ?? "Funcionário sem Nome"}</h1>
      <TabsWrapper
        userId={userId}
        employeeName={employeeName ?? "Funcionário sem nome"}
      />
      <div className="mx-auto max-w-xl pb-12">
        <FormEmployeeSchedule employeeId={userId} />
      </div>
    </>
  );
};

export default EmployerEmployeeByUserId;
