import type { FC, ReactNode } from "react";
import SidebarWrapper from "./sidebar-wrapper";
import { CreateOrganization, auth } from "@clerk/nextjs";
import { paths } from "~/constants/paths";
import { handleFirstLogin } from "~/actions/employer";
import { redirect } from "next/navigation";

type Props = {
  children: ReactNode;
};

const EmployerLayout: FC<Props> = async ({ children }) => {
  const { orgId, userId, orgRole } = auth();

  if (orgRole !== "admin") redirect(paths.employeeSchedule);

  if (orgId && userId) await handleFirstLogin({ orgId, userId });

  return (
    <SidebarWrapper>
      {!orgId ? (
        <div className="flex justify-center pt-16">
          <CreateOrganization
            afterCreateOrganizationUrl={paths.employerSchedule}
          />
        </div>
      ) : (
        children
      )}
    </SidebarWrapper>
  );
};

export default EmployerLayout;
