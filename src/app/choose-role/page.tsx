import { auth } from "@clerk/nextjs";
import { type Metadata } from "next";
import { redirect } from "next/navigation";
import { type FC } from "react";
import MyLink from "~/components/my-link";
import { paths } from "~/constants/paths";
import { roles } from "~/constants/roles";

export const metadata: Metadata = {
  title: "Escolha seu papel | ZipRH",
  description: "Você deve escolher entre gestor ou funcionário da organização",
};

const ChooseRolePage: FC = () => {
  const { orgRole } = auth();

  if (orgRole === roles.admin) return redirect(paths.employerSchedule);
  if (orgRole === roles.basicMember) return redirect(paths.employeeSchedule);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-y-6 rounded-xl border p-10 shadow">
        <h2>Escolha seu papel na organização</h2>
        <MyLink
          href={{ pathname: paths.userEdit, query: { isEmployee: "no" } }}
          variant="button-primary"
        >
          Sou Gestor
        </MyLink>
        <MyLink
          href={{ pathname: paths.userEdit, query: { isEmployee: "yes" } }}
          variant="button-secondary"
        >
          Sou Funcionário
        </MyLink>
      </div>
    </div>
  );
};

export default ChooseRolePage;
