import { redirect } from "next/navigation";

export default async function ManagePage({
  params,
}: {
  params: Promise<{ organizationSlug: string }>;
}) {
  const { organizationSlug } = await params;
  redirect(`/${organizationSlug}/manage/settings`);
}
