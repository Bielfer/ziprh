import { addDays } from "date-fns";
import { tryCatch } from "~/helpers/try-catch";
import { prisma } from "~/prisma/client";
import { stripe } from "~/services/stripe";

export const handleFirstLogin = async ({
  orgId,
  userId,
}: {
  orgId: string;
  userId: string;
}) => {
  const [subscriptions, errorFindingSubscription] = await tryCatch(
    prisma.subscription.findMany({ where: { userId } })
  );

  if (errorFindingSubscription) {
    console.log(errorFindingSubscription);
    return;
  }

  if (
    subscriptions?.find((subscription) => subscription.organizationId === orgId)
  )
    return;

  let customerId = subscriptions?.[0]?.customerId;

  if (!customerId) {
    const [customer, errorCustomer] = await tryCatch(stripe.customers.create());

    if (errorCustomer || !customer) {
      console.log(errorCustomer);
      return;
    }

    customerId = customer.id;
  }

  const [, errorSubscription] = await tryCatch(
    prisma.subscription.create({
      data: {
        userId,
        customerId,
        organizationId: orgId,
        renewAt: addDays(new Date(), 7),
        status: "trialing",
      },
    })
  );

  if (errorSubscription) console.log(errorSubscription);
};
