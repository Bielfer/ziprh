import { tryCatch } from "~/helpers/try-catch";
import { prisma } from "~/prisma/client";

export const findSubscription = async ({ orgId }: { orgId: string }) => {
  const [subscription, error] = await tryCatch(
    prisma.subscription.findUnique({
      where: {
        organizationId: orgId,
      },
    })
  );

  if (!subscription || error) return;

  return subscription;
};
