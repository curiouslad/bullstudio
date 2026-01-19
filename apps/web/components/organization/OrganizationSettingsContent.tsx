"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { OrganizationMemberRole } from "@bullstudio/prisma/browser";
import { Button } from "@bullstudio/ui/components/button";
import { Input } from "@bullstudio/ui/components/input";
import { Skeleton } from "@bullstudio/ui/components/skeleton";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@bullstudio/ui/components/avatar";
import { Badge } from "@bullstudio/ui/components/badge";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@bullstudio/ui/components/field";
import { trpc } from "@/lib/trpc";
import { useOrganizationContext } from "@/components/providers/OrganizationProvider";
import { toast } from "@bullstudio/ui/components/sonner";

const formSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(50, "Slug is too long")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must contain only lowercase letters, numbers, and hyphens"
    ),
});

type FormValues = z.infer<typeof formSchema>;

export function OrganizationSettingsContent() {
  const router = useRouter();
  const { orgId, orgSlug } = useOrganizationContext();
  const utils = trpc.useUtils();

  const { data: organization, isLoading } = trpc.organization.get.useQuery({
    organizationId: orgId,
  });

  const { control, handleSubmit, formState, reset } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (organization) {
      reset({
        name: organization.name,
        slug: organization.slug,
      });
    }
  }, [organization, reset]);

  const updateOrganization = trpc.organization.update.useMutation({
    onSuccess: (data) => {
      toast.success("Organization updated successfully");
      utils.organization.get.invalidate({ organizationId: orgId });
      utils.organization.list.invalidate();

      if (data.slug !== orgSlug) {
        router.push(`/${data.slug}/manage/settings`);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (values: FormValues) => {
    updateOrganization.mutate({
      organizationId: orgId,
      name: values.name,
      slug: values.slug,
    });
  };

  const isOwner =
    organization?.currentUserRole === OrganizationMemberRole.Owner;
  const isSubmitting = updateOrganization.isPending;

  if (isLoading) {
    return <OrganizationSettingsSkeleton />;
  }

  if (!organization) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* General Settings */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
        <h2 className="text-lg font-semibold text-zinc-100 mb-4">
          General Settings
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Organization Name</FieldLabel>
                <Input
                  {...field}
                  disabled={!isOwner || isSubmitting}
                  placeholder="My Organization"
                />
                <FieldDescription>
                  The display name for your organization.
                </FieldDescription>
                {fieldState.error && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="slug"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Organization Slug</FieldLabel>
                <Input
                  {...field}
                  disabled={!isOwner || isSubmitting}
                  placeholder="my-organization"
                />
                <FieldDescription>
                  Used in URLs to identify your organization. Only lowercase
                  letters, numbers, and hyphens.
                </FieldDescription>
                {fieldState.error && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {isOwner && (
            <Button
              type="submit"
              disabled={isSubmitting || !formState.isValid}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          )}
        </form>
      </div>

      {/* Organization Stats */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
        <h2 className="text-lg font-semibold text-zinc-100 mb-4">
          Organization Info
        </h2>
        <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <dt className="text-sm text-zinc-500">Workspaces</dt>
            <dd className="text-2xl font-semibold text-zinc-100">
              {organization._count.workspaces}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-zinc-500">Members</dt>
            <dd className="text-2xl font-semibold text-zinc-100">
              {organization.members.length}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-zinc-500">Created</dt>
            <dd className="text-lg font-medium text-zinc-100">
              {new Date(organization.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </dd>
          </div>
        </dl>
      </div>

      {/* Members List */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
        <h2 className="text-lg font-semibold text-zinc-100 mb-4">Members</h2>
        <div className="space-y-3">
          {organization.members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between py-3 border-b border-zinc-800 last:border-0"
            >
              <div className="flex items-center gap-3">
                <Avatar className="size-9">
                  <AvatarImage src={member.user.image ?? undefined} />
                  <AvatarFallback>
                    {member.user.name?.[0]?.toUpperCase() ?? "?"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-zinc-100">
                    {member.user.name ?? "Unknown"}
                  </p>
                  <p className="text-xs text-zinc-500">{member.user.email}</p>
                </div>
              </div>
              <Badge
                variant={
                  member.role === OrganizationMemberRole.Owner
                    ? "default"
                    : "secondary"
                }
              >
                {member.role}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function OrganizationSettingsSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-64 w-full bg-zinc-800/50" />
      <Skeleton className="h-32 w-full bg-zinc-800/50" />
      <Skeleton className="h-48 w-full bg-zinc-800/50" />
    </div>
  );
}
