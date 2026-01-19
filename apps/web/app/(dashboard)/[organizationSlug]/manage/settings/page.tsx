import { PageHeader } from "@/components/shell/PageHeader";
import { OrganizationSettingsContent } from "@/components/organization";

export default function OrganizationSettingsPage() {
  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Organization Settings" />
      <main className="flex-1 min-h-0 overflow-auto p-6">
        <OrganizationSettingsContent />
      </main>
    </div>
  );
}
