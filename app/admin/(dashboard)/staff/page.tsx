import Link from "next/link";
import PageHeader from "@/components/admin/PageHeader";
import Badge from "@/components/admin/Badge";
import { getStaffMembers } from "@/lib/admin/data/staff";
import { ROLE_LABELS, getModulesForRole } from "@/lib/admin/permissions";

export default async function AdminStaffPage() {
  const staffMembers = await getStaffMembers();
  return (
    <div>
      <PageHeader
        title="Staff Management"
        description="Roles and module permissions for the admin team."
        action={
          <Link href="/admin/staff/new" className="btn-primary text-sm">
            + Add Staff Member
          </Link>
        }
      />
      <div className="space-y-4">
        {staffMembers.map((s) => (
          <div key={s.id} className="card p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-heading font-semibold text-foreground">{s.fullName}</p>
                <p className="text-xs text-foreground/50">{s.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge tone="info">{ROLE_LABELS[s.role]}</Badge>
                <Link href={`/admin/staff/${s.id}`} className="text-sm text-primary hover:underline">
                  Edit
                </Link>
              </div>
            </div>
            <p className="mt-3 text-xs font-medium text-foreground/50">Module access</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {getModulesForRole(s.role).map((m) => (
                <Badge key={m.key} tone="neutral">{m.label}</Badge>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-xl bg-secondary/10 p-4 text-xs text-foreground/60">
        Module access is defined per role in <code>lib/admin/permissions.ts</code>. Edit
        that file to change what each role can see — every sidebar and route guard
        reads from the same table, so there's one place to update permissions.
      </div>
    </div>
  );
}
