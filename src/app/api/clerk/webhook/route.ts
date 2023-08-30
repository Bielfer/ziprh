import type { WebhookEvent } from "@clerk/nextjs/server";
import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { env } from "~/env.mjs";
import { tryCatch } from "~/helpers/try-catch";
import { clerkClient } from "@clerk/nextjs";
import { stripe } from "~/services/stripe";
import { prisma } from "~/prisma/client";

const updateStripeSubscription = async ({
  organizationId,
}: {
  organizationId: string;
}) => {
  const [organizationMembership, error] = await tryCatch(
    clerkClient.organizations.getOrganizationMembershipList({
      organizationId,
      limit: 20,
    })
  );

  if (error ?? !organizationMembership) {
    console.error(error);
    return;
  }

  const [subscription, errorSubscription] = await tryCatch(
    prisma.subscription.findUnique({ where: { organizationId } })
  );

  if (errorSubscription ?? !subscription) {
    console.error(errorSubscription);
    return;
  }

  const [stripeSubscriptions, errorStripeSubscriptions] = await tryCatch(
    stripe.subscriptions.list({
      customer: subscription.customerId,
    })
  );

  if (errorStripeSubscriptions) {
    console.error(errorStripeSubscriptions);
    return;
  }

  const toUpdateSubscription = stripeSubscriptions?.data.find(
    (item) => item.id === subscription.stripeId
  );

  if (!toUpdateSubscription) {
    console.error("No subscription to updatefound");
    return;
  }

  const [, errorUpdatingSubscription] = await tryCatch(
    stripe.subscriptions.update(subscription.stripeId, {
      items: [
        {
          id: toUpdateSubscription.items.data[0]?.id,
          quantity: organizationMembership.length - 1,
        },
      ],
    })
  );

  if (errorUpdatingSubscription) {
    console.error(errorUpdatingSubscription);
  }
};

const webhookSecret: string = env.CLERK_WEBHOOK_SECRET ?? "";

export async function POST(req: Request) {
  const payload = await req.json();
  const payloadString = JSON.stringify(payload);
  const headerPayload = headers();
  const svixId = headerPayload.get("svix-id");
  const svixIdTimeStamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixIdTimeStamp || !svixSignature) {
    return new NextResponse("Error ocurred", {
      status: 400,
    });
  }

  const svixHeaders = {
    "svix-id": svixId,
    "svix-timestamp": svixIdTimeStamp,
    "svix-signature": svixSignature,
  };

  const wh = new Webhook(webhookSecret);

  let evt: WebhookEvent;
  try {
    evt = wh.verify(payloadString, svixHeaders) as WebhookEvent;
  } catch (_) {
    console.error("error");
    return new NextResponse("Error ocurred", {
      status: 400,
    });
  }
  const eventType = evt.type;

  switch (eventType) {
    case "organizationInvitation.accepted":
      await updateStripeSubscription({
        organizationId: evt.data.organization_id,
      });

      break;
    case "organizationMembership.deleted":
      await updateStripeSubscription({
        organizationId: evt.data.organization.id,
      });

      break;
  }
  return new NextResponse("", {
    status: 201,
  });
}
