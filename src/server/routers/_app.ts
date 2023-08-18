import { router } from "../trpc";
import { clockInsRouter } from "./clock-ins";

const appRouter = router({
  clockIns: clockInsRouter,
});

export type AppRouter = typeof appRouter;

export default appRouter;
