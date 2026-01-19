import { z } from "zod";

export const getOrganizationSchema = z.object({
  organizationId: z.string(),
});

export type GetOrganizationInput = z.infer<typeof getOrganizationSchema>;
