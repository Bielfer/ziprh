import { TRPCError } from "@trpc/server";
import { middleware } from "./trpc";
import { type roles } from "~/constants/roles";
import { type ObjectValues } from "~/types/core";

export const isRole = (role: ObjectValues<typeof roles>) =>
  middleware(({ ctx, next }) => {
    if (ctx.auth.orgRole !== role) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You don't have permission to access this resource!",
      });
    }

    return next();
  });

export const hasOrganization = middleware(({ ctx, next }) => {
  if (!ctx.auth.orgId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "No organization provided!",
    });
  }

  return next({
    ctx: {
      auth: { ...ctx.auth, orgId: ctx.auth.orgId },
    },
  });
});
