"use client";
import { type Subscription } from "@prisma/client";
import { addDays, differenceInHours } from "date-fns";
import { useState, type FC } from "react";
import Banner from "~/components/banner";
import { gracePeriod } from "~/constants/payments";

type Props = {
  subscription?: Subscription | null;
};

const BannerWrapper: FC<Props> = ({ subscription }) => {
  const [isOpen, setIsOpen] = useState(true);

  if (
    subscription?.status !== "trialing" &&
    subscription?.status !== "past_due"
  )
    return null;

  const isTrialing = subscription.status === "trialing";
  const hoursUntilTrialEnds = differenceInHours(
    isTrialing
      ? subscription?.renewAt ?? new Date()
      : addDays(subscription?.renewAt ?? new Date(), gracePeriod),
    new Date()
  );
  const daysRemaining = Math.floor(hoursUntilTrialEnds / 24);
  const hoursRemaining = hoursUntilTrialEnds % 24;

  return (
    <Banner
      className="mb-6"
      isOpen={isOpen}
      handleClose={() => setIsOpen(false)}
      title={isTrialing ? "Período de Teste Grátis" : "Falha no pagamento"}
      subtitle={`${
        isTrialing
          ? "O período de teste grátis da sua organização termina em"
          : "Fale com seu supervisor para corrigir o pagamento em até"
      }${
        daysRemaining === 0
          ? ""
          : ` ${daysRemaining} dia${daysRemaining > 1 ? "s" : ""} e`
      } ${hoursRemaining} horas`}
    />
  );
};

export default BannerWrapper;
