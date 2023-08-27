import { router, privateProcedure } from "~/server/trpc";
import { env } from "~/env.mjs";
import { clerkClient } from "@clerk/nextjs";
import { tryCatch } from "~/helpers/try-catch";
import { TRPCError } from "@trpc/server";
import { paths } from "~/constants/paths";
import { prisma } from "~/prisma/client";
import { stripe } from "~/services/stripe";
import { z } from "zod";

const priceId = env.STRIPE_PRICE_ID;
const appUrl = env.NEXT_PUBLIC_APP_URL;

export const stripeRouter = router({
  createCheckoutSession: privateProcedure
    .input(z.object({ cancelUrl: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { orgId } = ctx.auth;
      const { cancelUrl } = input;

      if (!orgId)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No organization provided!",
        });

      const [organizationMembers, errorOrganization] = await tryCatch(
        clerkClient.organizations.getOrganizationMembershipList({
          organizationId: orgId,
          limit: 20,
        })
      );

      if (!organizationMembers || errorOrganization)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: errorOrganization,
        });

      const [subscription, errorSubscription] = await tryCatch(
        prisma.subscription.findUnique({ where: { organizationId: orgId } })
      );

      if (errorSubscription || !subscription)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: errorSubscription,
        });

      const [session, errorSession] = await tryCatch(
        stripe.checkout.sessions.create({
          billing_address_collection: "auto",
          locale: "pt-BR",
          line_items: [
            {
              price: priceId,
              quantity: organizationMembers.length - 1,
            },
          ],
          mode: "subscription",
          success_url: `${appUrl}${paths.employerSubscriptionSuccess}`,
          cancel_url: `${appUrl}${cancelUrl}`,
          customer: subscription.customerId,
          subscription_data: {
            metadata: {
              subscriptionId: subscription.id,
            },
          },
        })
      );

      if (errorSession)
        throw new TRPCError({ code: "BAD_REQUEST", message: errorSession });

      return session;
    }),
  createPortalSession: privateProcedure.mutation(async ({ ctx }) => {
    const { orgId } = ctx.auth;

    const [subscription, errorSubscription] = await tryCatch(
      prisma.subscription.findFirst({
        where: {
          organizationId: orgId,
        },
      })
    );

    if (errorSubscription || !subscription)
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: errorSubscription ?? "No subscription for this organization!",
      });

    const [portalSession, errorPortalSession] = await tryCatch(
      stripe.billingPortal.sessions.create({
        customer: subscription.customerId,
        return_url: `${appUrl}${paths.employerSubscriptionSuccess}`,
        locale: "pt-BR",
      })
    );

    if (errorPortalSession)
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: errorPortalSession,
      });

    return portalSession;
  }),
});

export type StripeRouter = typeof stripeRouter;
