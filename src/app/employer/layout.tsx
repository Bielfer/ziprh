import type { FC, ReactNode } from "react";
import SidebarWrapper from "./sidebar-wrapper";
import { CreateOrganization, auth } from "@clerk/nextjs";
import { paths } from "~/constants/paths";

type Props = {
  children: ReactNode;
};

const EmployerLayout: FC<Props> = ({ children }) => {
  const { orgId } = auth();

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
