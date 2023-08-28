import { ClockIcon } from "@heroicons/react/24/outline";
import { type Subscription } from "@prisma/client";
import { addDays, isAfter } from "date-fns";
import type { FC, ReactNode } from "react";
import EmptyState from "~/components/empty-state";
import { gracePeriod } from "~/constants/payments";
import SubscriptionWrapperButton from "./subscription-wrapper-button";

type Props = {
  subscription?: Subscription | null;
  isEmployee?: boolean;
  children: ReactNode;
};

const SubscriptionWrapper: FC<Props> = ({
  subscription,
  children,
  isEmployee,
}) => {
  const today = new Date();
  const isSubscribed =
    !!subscription &&
    isAfter(
      subscription.status === "trialing"
        ? subscription.renewAt
        : addDays(subscription.renewAt, gracePeriod),
      today
    );

  if (!isSubscribed)
    return (
      <EmptyState
        className="pt-10"
        icon={ClockIcon}
        title="Plano expirado"
        subtitle={`Para voltar a acessar a plataforma você deve ${
          isEmployee ? "falar com seu supervisor" : "retomar a assinatura"
        }`}
        buttonOrLink={!isEmployee ? <SubscriptionWrapperButton /> : undefined}
      />
    );

  return children;
};

export default SubscriptionWrapper;
