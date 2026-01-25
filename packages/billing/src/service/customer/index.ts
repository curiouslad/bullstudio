import { prisma } from "@bullstudio/prisma";
import { type Polar } from "@polar-sh/sdk";

export const createCustomer = async ({
  polar,
  userId,
  email,
  name,
  orgId,
}: {
  polar: Polar;
  userId: string;
  email: string;
  name: string;
  orgId: string;
}) => {
  const newCustomer = await polar.customers.create({
    email,
    name,
    //organizationId: orgId,
    metadata: {
      userId,
    },
  });

  return newCustomer.id;
};

export const ensureCustomer = async ({
  orgId,
  polar,
}: {
  orgId: string;
  polar: Polar;
}) => {
  const org = await prisma.organization.findUnique({
    where: { id: orgId },
    select: {
      polarCustomerId: true,
      members: {
        select: {
          role: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  if (!org) {
    throw new Error(
      "Ensure customer error: Org with id " + orgId + "does not exist!",
    );
  }

  if (org.polarCustomerId) return org.polarCustomerId;

  const orgOwner = org.members.find((member) => member.role === "Owner");

  if (!orgOwner) {
    throw new Error("No owner for org " + orgId);
  }

  const newCustomer = await polar.customers.create({
    email: orgOwner.user.email,
    name: orgOwner.user.name,
    //organizationId: orgId,
    metadata: {
      userId: orgOwner.user.id,
    },
  });

  await prisma.organization.update({
    where: { id: orgId },
    data: { polarCustomerId: newCustomer.id },
  });

  return newCustomer.id;
};
