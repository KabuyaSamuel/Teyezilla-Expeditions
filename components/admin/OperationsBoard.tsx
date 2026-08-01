"use client";

import { useState } from "react";
import type { Departure } from "@/lib/admin/data/operations";
import type { StaffMember } from "@/lib/admin/data/staff";
import type { AdminVehicle } from "@/lib/admin/data/vehicles";
import type { DepartureAssignment } from "@/lib/admin/actions/operations";

function DepartureRow({
  departure,
  guides,
  drivers,
  vehicles,
  onAssign,
}: {
  departure: Departure;
  guides: StaffMember[];
  drivers: StaffMember[];
  vehicles: AdminVehicle[];
  onAssign: (bookingId: string, input: DepartureAssignment) => Promise<void>;
}) {
  const [guideId, setGuideId] = useState(departure.assignedGuideId ?? "");
  const [driverId, setDriverId] = useState(departure.assignedDriverId ?? "");
  const [vehicleId, setVehicleId] = useState(departure.assignedVehicleId ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save(next: Partial<{ guideId: string; driverId: string; vehicleId: string }>) {
    setSaving(true);
    setSaved(false);
    try {
      await onAssign(departure.id, {
        guideId: (next.guideId ?? guideId) || null,
        driverId: (next.driverId ?? driverId) || null,
        vehicleId: (next.vehicleId ?? vehicleId) || null,
      });
      setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <tr className="border-b border-secondary/10 last:border-0">
      <td className="px-5 py-3 font-medium text-foreground">{departure.bookingReference}</td>
      <td className="px-5 py-3 text-foreground/70">{departure.productTitle}</td>
      <td className="px-5 py-3 text-foreground/70">{departure.travelDate ?? "-"}</td>
      <td className="px-5 py-3 text-foreground/70">{departure.travelerCount}</td>
      <td className="px-5 py-3">
        <select
          value={guideId}
          onChange={(e) => {
            setGuideId(e.target.value);
            save({ guideId: e.target.value });
          }}
          disabled={saving}
          className="w-full rounded-full border border-secondary/40 px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Unassigned</option>
          {guides.map((g) => (
            <option key={g.id} value={g.id}>{g.fullName}</option>
          ))}
        </select>
      </td>
      <td className="px-5 py-3">
        <select
          value={driverId}
          onChange={(e) => {
            setDriverId(e.target.value);
            save({ driverId: e.target.value });
          }}
          disabled={saving}
          className="w-full rounded-full border border-secondary/40 px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Unassigned</option>
          {drivers.map((d) => (
            <option key={d.id} value={d.id}>{d.fullName}</option>
          ))}
        </select>
      </td>
      <td className="px-5 py-3">
        <select
          value={vehicleId}
          onChange={(e) => {
            setVehicleId(e.target.value);
            save({ vehicleId: e.target.value });
          }}
          disabled={saving}
          className="w-full rounded-full border border-secondary/40 px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Unassigned</option>
          {vehicles.map((v) => (
            <option key={v.id} value={v.id}>{v.name}</option>
          ))}
        </select>
      </td>
      <td className="px-5 py-3 text-xs text-foreground/40">{saving ? "Saving…" : saved ? "Saved" : ""}</td>
    </tr>
  );
}

export default function OperationsBoard({
  departures,
  guides,
  drivers,
  vehicles,
  onAssign,
}: {
  departures: Departure[];
  guides: StaffMember[];
  drivers: StaffMember[];
  vehicles: AdminVehicle[];
  onAssign: (bookingId: string, input: DepartureAssignment) => Promise<void>;
}) {
  if (departures.length === 0) {
    return <div className="card p-6 text-center text-sm text-foreground/50">No upcoming confirmed departures.</div>;
  }

  return (
    <div className="card overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-secondary/20 text-xs uppercase tracking-wide text-foreground/50">
          <tr>
            <th className="px-5 py-3">Reference</th>
            <th className="px-5 py-3">Product</th>
            <th className="px-5 py-3">Travel Date</th>
            <th className="px-5 py-3">Travelers</th>
            <th className="px-5 py-3">Guide</th>
            <th className="px-5 py-3">Driver</th>
            <th className="px-5 py-3">Vehicle</th>
            <th className="px-5 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {departures.map((d) => (
            <DepartureRow key={d.id} departure={d} guides={guides} drivers={drivers} vehicles={vehicles} onAssign={onAssign} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
