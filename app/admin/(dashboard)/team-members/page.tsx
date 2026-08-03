import Link from "next/link";
import PageHeader from "@/components/admin/PageHeader";
import Badge from "@/components/admin/Badge";
import ResponsiveTable, { MobileCardField, MobileCardHeader } from "@/components/admin/ResponsiveTable";
import { getAdminTeamMembers } from "@/lib/admin/data/team-members";
import { contentStatusTone } from "@/lib/admin/status-tone";

export default async function AdminTeamMembersPage() {
  const teamMembers = await getAdminTeamMembers();

  return (
    <div>
      <PageHeader
        title="Team Members"
        description="Staff bios for the About page team section."
        action={
          <Link href="/admin/team-members/new" className="btn-primary text-sm">
            + Add Team Member
          </Link>
        }
      />

      <ResponsiveTable
        rows={teamMembers}
        keyField={(t) => t.id}
        emptyMessage="No team members yet. Add the first one to get started."
        columns={[
          { header: "Name", cell: (t) => t.fullName, className: "font-medium text-foreground" },
          { header: "Role", cell: (t) => t.roleTitle || "-" },
          { header: "Status", cell: (t) => <Badge tone={contentStatusTone(t.status)}>{t.status}</Badge> },
          { header: "", cell: (t) => <Link href={`/admin/team-members/${t.id}`} className="text-primary hover:underline">Edit</Link> },
        ]}
        renderMobileCard={(t) => (
          <>
            <MobileCardHeader
              title={t.fullName}
              subtitle={t.roleTitle || "-"}
              action={<Link href={`/admin/team-members/${t.id}`} className="hover:underline">Edit</Link>}
            />
            <div className="mt-3 space-y-1 border-t border-secondary/10 pt-3">
              <MobileCardField label="Status" value={<Badge tone={contentStatusTone(t.status)}>{t.status}</Badge>} />
            </div>
          </>
        )}
      />
    </div>
  );
}
