import { router } from "../trpc";
import { clockInsRouter } from "./clock-ins";
import { dayOffRouter } from "./days-off";
import { schedulesRouter } from "./schedules";
import { stripeRouter } from "./stripe";
import { userRouter } from "./user";

const appRouter = router({
  clockIns: clockInsRouter,
  schedules: schedulesRouter,
  dayOff: dayOffRouter,
  stripe: stripeRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;

export default appRouter;
