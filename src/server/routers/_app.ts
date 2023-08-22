import { router } from "../trpc";
import { clockInsRouter } from "./clock-ins";
import { schedulesRouter } from "./schedules";

const appRouter = router({
  clockIns: clockInsRouter,
  schedules: schedulesRouter,
});

export type AppRouter = typeof appRouter;

export default appRouter;
