import { createTRPCRouter } from "./init";
import { jobRouter } from "./routers/job";
import { queueRouter } from "./routers/queue";
import { overviewRouter } from "./routers/overview";
import { connectionRouter } from "./routers/connection";
import { flowRouter } from "./routers/flow";

export const trpcRouter = createTRPCRouter({
  jobs: jobRouter,
  queues: queueRouter,
  overview: overviewRouter,
  connection: connectionRouter,
  flows: flowRouter,
});

export type TRPCRouter = typeof trpcRouter;
