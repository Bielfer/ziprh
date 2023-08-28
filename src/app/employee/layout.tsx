import type { FC, ReactNode } from "react";
import SidebarWrapper from "./sidebar-wrapper";
import { auth } from "@clerk/nextjs";
import EmptyState from "~/components/empty-state";
import { UserGroupIcon } from "@heroicons/react/24/outline";
import SubscriptionWrapper from "../subscription-wrapper";
import { findSubscription } from "~/actions/employee";
import { roles } from "~/constants/roles";
import { redirect } from "next/navigation";
import { paths } from "~/constants/paths";
import BannerWrapper from "./banner-wrapper";

type Props = {
  children: ReactNode;
};

const EmployeeLayout: FC<Props> = async ({ children }) => {
  const { orgId, orgRole } = auth();

  if (orgId && orgRole !== roles.basicMember) redirect(paths.employerSchedule);

  const subscription = await findSubscription({ orgId: orgId ?? "" });

  return (
    <SidebarWrapper>
      <SubscriptionWrapper subscription={subscription} isEmployee>
        <BannerWrapper subscription={subscription} />
        {!orgId ? (
          <div className="pt-16">
            <EmptyState
              className="mx-auto max-w-md"
              icon={UserGroupIcon}
              title="Nenhuma organização escolhida!"
              subtitle="Para escolher uma organização basta clicar no botão nenhuma organização selecionada. Se nenhuma estiver disponível, peça para seu gestor enviar outro convite"
            />
          </div>
        ) : (
          children
        )}
      </SubscriptionWrapper>
    </SidebarWrapper>
  );
};

export default EmployeeLayout;
