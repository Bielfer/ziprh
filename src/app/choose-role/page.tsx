import { type Metadata } from "next";
import { type FC } from "react";
import MyLink from "~/components/my-link";
import { paths } from "~/constants/paths";

export const metadata: Metadata = {
  title: "Escolha seu papel | ZipRH",
  description: "Você deve escolher entre gestor ou funcionário da organização",
};

const ChooseRolePage: FC = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-y-6 rounded-xl border p-10 shadow">
        <h2>Escolha seu papel na organização</h2>
        <MyLink href={paths.employerSchedule} variant="button-primary">
          Sou Gestor
        </MyLink>
        <MyLink href={paths.employeeSchedule} variant="button-secondary">
          Sou Funcionário
        </MyLink>
      </div>
    </div>
  );
};

export default ChooseRolePage;
