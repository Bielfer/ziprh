import { router } from "../trpc";
import { clockInsRouter } from "./clock-ins";
import { dayOffRouter } from "./day-off";
import { schedulesRouter } from "./schedules";

const appRouter = router({
  clockIns: clockInsRouter,
  schedules: schedulesRouter,
  dayOff: dayOffRouter,
});

export type AppRouter = typeof appRouter;

export default appRouter;
