import { AuthedTRPCContext } from "../../types";
import { organizationGuard } from "../../guards/organization";
import { GetOrganizationInput } from "./get.schema";

type GetOrganizationHandlerProps = {
  ctx: AuthedTRPCContext;
  input: GetOrganizationInput;
};

export async function getOrganizationHandler({
  ctx,
  input,
}: GetOrganizationHandlerProps) {
  const { prisma, user } = ctx;

  const { organization, member } = await organizationGuard({
    ctx,
    organizationId: input.organizationId,
  });

  const orgWithDetails = await prisma.organization.findUnique({
    where: { id: input.organizationId },
    include: {
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
      _count: {
        select: {
          workspaces: true,
        },
      },
    },
  });

  return {
    ...orgWithDetails!,
    currentUserRole: member.role,
  };
}
