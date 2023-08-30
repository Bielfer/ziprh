import { type Subscription } from "@prisma/client";
import { addDays } from "date-fns";
import { trialPeriod } from "~/constants/payments";
import { tryCatch } from "~/helpers/try-catch";
import { prisma } from "~/prisma/client";
import { stripe } from "~/services/stripe";

export const findSubscription = async ({
  userId,
  orgId,
}: {
  userId: string;
  orgId: string;
}) => {
  const [subscriptions, errorFindingSubscription] = await tryCatch(
    prisma.subscription.findMany({ where: { userId } })
  );

  if (errorFindingSubscription) {
    console.error(errorFindingSubscription);
    return;
  }

  return {
    subscription: subscriptions?.find(
      (subscription) => subscription.organizationId === orgId
    ),
    customerId: subscriptions?.[0]?.customerId,
  };
};

export const handleFirstOrganizationLogin = async ({
  orgId,
  userId,
  subscription,
  customerId,
}: {
  orgId: string;
  userId: string;
  subscription?: Subscription | null;
  customerId?: string;
}) => {
  if (!!subscription) return subscription;

  if (!customerId) {
    const [customer, errorCustomer] = await tryCatch(stripe.customers.create());

    if (errorCustomer || !customer) {
      console.error(errorCustomer);
      return;
    }

    customerId = customer.id;
  }

  const [createdSubscription, errorSubscription] = await tryCatch(
    prisma.subscription.create({
      data: {
        userId,
        customerId,
        organizationId: orgId,
        renewAt: addDays(new Date(), trialPeriod),
        status: "trialing",
      },
    })
  );

  if (errorSubscription) {
    console.error(errorSubscription);
    return;
  }

  return createdSubscription;
};
