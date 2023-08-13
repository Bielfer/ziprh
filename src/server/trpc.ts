import { TRPCError, initTRPC } from "@trpc/server";
import superjson from "superjson";
import { type Context } from "./context";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const { router, middleware } = t;

const logger = middleware(async ({ path, type, next }) => {
  const start = Date.now();
  const result = await next();
  const durationMs = Date.now() - start;

  if (result.ok) console.log("OK request timing:", { path, type, durationMs });
  else console.error("Error request timing", { path, type, durationMs });

  return result;
});

const isAuthenticated = middleware(({ ctx, next }) => {
  if (!ctx.auth.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      auth: ctx.auth,
    },
  });
});

export const publicProcedure = t.procedure.use(logger);

export const privateProcedure = t.procedure.use(logger).use(isAuthenticated);
