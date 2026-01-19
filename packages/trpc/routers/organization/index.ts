import { authedProcedure, router } from "../../init";
import { listOrganizationsHandler } from "./list.handler";
import { getOrganizationSchema } from "./get.schema";
import { getOrganizationHandler } from "./get.handler";
import { updateOrganizationSchema } from "./update.schema";
import { updateOrganizationHandler } from "./update.handler";

export const organizationRouter = router({
  list: authedProcedure.query(({ ctx }) => {
    return listOrganizationsHandler({ ctx });
  }),

  get: authedProcedure.input(getOrganizationSchema).query(({ ctx, input }) => {
    return getOrganizationHandler({ ctx, input });
  }),

  update: authedProcedure
    .input(updateOrganizationSchema)
    .mutation(({ ctx, input }) => {
      return updateOrganizationHandler({ ctx, input });
    }),
});
