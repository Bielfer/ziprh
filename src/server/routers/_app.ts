import { z } from "zod";
import { publicProcedure, router } from "../trpc";

const appRouter = router({
  test: router({
    create: publicProcedure.input(z.object({})).query(({ ctx }) => {
      const { userId } = ctx.auth;
      console.log(userId);
      return { message: "test" };
    }),
  }),
});

export type AppRouter = typeof appRouter;

export default appRouter;
