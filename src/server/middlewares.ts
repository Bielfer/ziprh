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
