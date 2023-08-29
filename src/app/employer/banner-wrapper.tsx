"use client";
import { type Subscription } from "@prisma/client";
import { addDays, differenceInHours } from "date-fns";
import { usePathname } from "next/navigation";
import { useState, type FC } from "react";
import type Stripe from "stripe";
import Banner from "~/components/banner";
import Spinner from "~/components/spinner";
import { useToast } from "~/components/toast";
import { gracePeriod } from "~/constants/payments";
import { tryCatch } from "~/helpers/try-catch";
import { trpc } from "~/services/trpc";

type Props = {
  subscription?: Subscription | null;
};

const BannerWrapper: FC<Props> = ({ subscription }) => {
  const pathname = usePathname();
  const { addToast } = useToast();
  const {
    mutateAsync: createCheckoutSession,
    isLoading: isLoadingCheckoutSession,
  } = trpc.stripe.createCheckoutSession.useMutation();
  const {
    mutateAsync: createPortalSession,
    isLoading: isLoadingPortalSession,
  } = trpc.stripe.createPortalSession.useMutation();
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

  const handleClick = async () => {
    let session:
      | Stripe.Response<Stripe.Checkout.Session>
      | Stripe.Response<Stripe.BillingPortal.Session>
      | null;
    let error;

    if (isTrialing) {
      [session, error] = await tryCatch(
        createCheckoutSession({
          cancelUrl: pathname,
        })
      );
    } else {
      [session, error] = await tryCatch(
        createPortalSession({ returnUrl: pathname })
      );
    }

    if (error || !session || !session.url) {
      addToast({
        type: "error",
        content:
          "Falha ao redirecionar para página de pagamento, tente novamente quando essa mensagem fechar",
        duration: 5000,
      });
      return;
    }

    window.location.href = session.url;
  };

  if (daysRemaining <= 0 && hoursRemaining <= 0) return null;

  return (
    <Banner
      className="mb-6"
      isOpen={isOpen}
      handleClose={() => setIsOpen(false)}
      title={isTrialing ? "Período de Teste Grátis" : "Falha no pagamento"}
      subtitle={`${
        isTrialing
          ? "Seu período de teste grátis termina em"
          : "Você deve corrigir o pagamento em até"
      }${
        daysRemaining === 0
          ? ""
          : ` ${daysRemaining} dia${daysRemaining > 1 ? "s" : ""} e`
      } ${hoursRemaining} horas`}
      button={
        <button
          onClick={handleClick}
          className="flex-none rounded-full bg-gray-900 px-3.5 py-1 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
        >
          {isLoadingCheckoutSession || isLoadingPortalSession ? (
            <Spinner size="sm" color="white" />
          ) : (
            <>
              {isTrialing ? "Assine" : "Corrija"} Agora{" "}
              <span aria-hidden="true">&rarr;</span>
            </>
          )}
        </button>
      }
    />
  );
};

export default BannerWrapper;
