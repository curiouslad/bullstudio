import { TRPCError } from "@trpc/server";
import { OrganizationMemberRole } from "@bullstudio/prisma";
import { AuthedTRPCContext } from "../../types";
import { organizationGuard } from "../../guards/organization";
import { UpdateOrganizationInput } from "./update.schema";

type UpdateOrganizationHandlerProps = {
  ctx: AuthedTRPCContext;
  input: UpdateOrganizationInput;
};

export async function updateOrganizationHandler({
  ctx,
  input,
}: UpdateOrganizationHandlerProps) {
  const { prisma } = ctx;

  const { organization } = await organizationGuard({
    ctx,
    organizationId: input.organizationId,
    requiredRole: OrganizationMemberRole.Owner,
  });

  if (input.slug !== organization.slug) {
    const existingOrg = await prisma.organization.findUnique({
      where: { slug: input.slug },
    });

    if (existingOrg) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "An organization with this slug already exists",
      });
    }
  }

  const updatedOrganization = await prisma.organization.update({
    where: { id: input.organizationId },
    data: {
      name: input.name,
      slug: input.slug,
    },
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

  return updatedOrganization;
}
