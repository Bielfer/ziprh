import { fromUnixTime } from "date-fns";
import { NextResponse } from "next/server";
import { buffer } from "node:stream/consumers";
import { env } from "~/env.mjs";
import { prisma } from "~/prisma/client";
import { stripe } from "~/services/stripe";

export const POST = async (req: Request) => {
  let event = (await buffer(req.body as any)) as any;
  const endpointSecret = env.STRIPE_WEBHOOK_SECRET;

  if (endpointSecret) {
    const signature = req.headers.get("stripe-signature");
    try {
      event = stripe.webhooks.constructEvent(
        event,
        signature as any,
        endpointSecret
      );
    } catch (err: any) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message);
      return NextResponse.json(err, { status: 400 });
    }
  }
  let subscription;
  let status;
  switch (event.type) {
    case "customer.subscription.deleted":
      subscription = event.data.object;
      status = subscription.status;

      await prisma.subscription.update({
        where: { id: parseInt(subscription.metadata.subscriptionId) },
        data: {
          status,
        },
      });

      break;
    case "customer.subscription.created":
      subscription = event.data.object;
      status = subscription.status;

      await prisma.subscription.update({
        where: { id: parseInt(subscription.metadata.subscriptionId) },
        data: {
          status,
          renewAt: fromUnixTime(subscription.current_period_end),
          stripeId: subscription.id,
        },
      });

      break;
    case "customer.subscription.updated":
      subscription = event.data.object;
      status = subscription.status;

      await prisma.subscription.update({
        where: { id: parseInt(subscription.metadata.subscriptionId) },
        data: {
          status,
          renewAt: fromUnixTime(subscription.current_period_end),
        },
      });

      break;
    case "customer.subscription.resumed":
      subscription = event.data.object;
      status = subscription.status;

      await prisma.subscription.update({
        where: { id: parseInt(subscription.metadata.subscriptionId) },
        data: {
          status,
          renewAt: fromUnixTime(subscription.current_period_end),
        },
      });

      break;
    case "customer.subscription.paused":
      subscription = event.data.object;
      status = subscription.status;

      await prisma.subscription.update({
        where: { id: parseInt(subscription.metadata.subscriptionId) },
        data: {
          status,
          renewAt: fromUnixTime(subscription.current_period_end),
        },
      });

      break;
    default:
      console.log(`Unhandled event type ${event.type}.`);
  }

  return NextResponse.json({}, { status: 200 });
};
