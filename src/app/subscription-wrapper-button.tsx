"use client";
import { ArrowUturnLeftIcon } from "@heroicons/react/20/solid";
import { usePathname } from "next/navigation";
import type { FC } from "react";
import Button from "~/components/button";
import { useToast } from "~/components/toast";
import { tryCatch } from "~/helpers/try-catch";
import { trpc } from "~/services/trpc";

const SubscriptionWrapperButton: FC = () => {
  const pathname = usePathname();
  const { addToast } = useToast();
  const { mutateAsync: createCheckoutSession, isLoading } =
    trpc.stripe.createCheckoutSession.useMutation();

  const handleClick = async () => {
    const [session, error] = await tryCatch(
      createCheckoutSession({ cancelUrl: pathname })
    );

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

  return (
    <Button
      variant="primary"
      iconLeft={ArrowUturnLeftIcon}
      onClick={handleClick}
      loading={isLoading}
    >
      Retomar Assinatura
    </Button>
  );
};

export default SubscriptionWrapperButton;
