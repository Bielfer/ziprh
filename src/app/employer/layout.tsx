import type { FC, ReactNode } from "react";
import SidebarWrapper from "./sidebar-wrapper";
import { CreateOrganization, auth } from "@clerk/nextjs";
import { paths } from "~/constants/paths";
import {
  findSubscription,
  handleFirstOrganizationLogin,
} from "~/actions/employer";
import { redirect } from "next/navigation";
import BannerWrapper from "./banner-wrapper";
import { type Subscription } from "@prisma/client";
import SubscriptionWrapper from "../subscription-wrapper";
import { roles } from "~/constants/roles";

type Props = {
  children: ReactNode;
};

const EmployerLayout: FC<Props> = async ({ children }) => {
  const { orgId, userId, orgRole } = auth();

  if (orgId && orgRole !== roles.admin) redirect(paths.employeeSchedule);

  let subscription: Subscription | undefined | null;

  if (orgId && userId) {
    const activeSubscription = await findSubscription({ orgId, userId });
    subscription = await handleFirstOrganizationLogin({
      orgId,
      userId,
      subscription: activeSubscription?.subscription,
      customerId: activeSubscription?.customerId,
    });
  }

  return (
    <SidebarWrapper>
      <BannerWrapper subscription={subscription} />

      {!orgId ? (
        <div className="flex justify-center pt-16">
          <CreateOrganization
            afterCreateOrganizationUrl={paths.employerSchedule}
            skipInvitationScreen
          />
        </div>
      ) : (
        <SubscriptionWrapper subscription={subscription}>
          {children}
        </SubscriptionWrapper>
      )}
    </SidebarWrapper>
  );
};

export default EmployerLayout;
