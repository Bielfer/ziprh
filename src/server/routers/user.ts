import { router, privateProcedure } from "~/server/trpc";
import { z } from "zod";
import { clerkClient } from "@clerk/nextjs";
import { tryCatch } from "~/helpers/try-catch";
import { TRPCError } from "@trpc/server";

export const userRouter = router({
  update: privateProcedure
    .input(
      z.object({
        firstName: z.string(),
        lastName: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { userId } = ctx.auth;
      const { firstName, lastName } = input;

      const [updatedUser, error] = await tryCatch(
        clerkClient.users.updateUser(userId, { firstName, lastName })
      );

      if (error) throw new TRPCError({ code: "BAD_REQUEST", message: error });

      return updatedUser;
    }),
});

export type UserRouter = typeof userRouter;
