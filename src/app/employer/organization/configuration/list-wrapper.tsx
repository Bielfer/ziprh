"use client";
import { useOrganization } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import type { FC } from "react";
import Button from "~/components/button";
import DescriptionList from "~/components/description-list";
import { useToast } from "~/components/toast";
import { roles } from "~/constants/roles";
import { tryCatch } from "~/helpers/try-catch";
import { trpc } from "~/services/trpc";

const ListWrapper: FC = () => {
  const pathname = usePathname();
  const { addToast } = useToast();
  const { mutateAsync: createPortalSession, isLoading } =
    trpc.stripe.createPortalSession.useMutation();

  const { membershipList } = useOrganization({
    membershipList: { role: [roles.basicMember], limit: 20 },
  });

  return (
    <DescriptionList
      className="mx-auto max-w-2xl pt-10"
      items={[
        {
          label: "Pagamento",
          value: `R$ ${(membershipList?.length ?? 0) * 10}`,
          buttonsOrLinks: [
            <Button
              key={1}
              variant="link-primary"
              loading={isLoading}
              onClick={async () => {
                const [session, error] = await tryCatch(
                  createPortalSession({ returnUrl: pathname })
                );

                if (error || !session) {
                  addToast({
                    type: "error",
                    content:
                      "Falha ao abrir página de pagamentos, tente novamente no fim dessa mensagem",
                    duration: 5000,
                  });
                  return;
                }

                window.location.href = session.url;
              }}
            >
              Gerenciar
            </Button>,
          ],
        },
      ]}
    />
  );
};

export default ListWrapper;
