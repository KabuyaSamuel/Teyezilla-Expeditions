export interface InventoryRecord {
  id: string;
  tourTitle: string;
  date: string;
  capacity: number;
  bookedCount: number;
  guideAssigned?: string;
  driverAssigned?: string;
  vehicle?: string;
}

export const seedInventoryRecords: InventoryRecord[] = [
  { id: "inv1", tourTitle: "Maasai Mara Safari", date: "2026-08-14", capacity: 8, bookedCount: 2, guideAssigned: "Peter Kamau", driverAssigned: "Samuel Njoroge", vehicle: "Land Cruiser KDA 221B" },
  { id: "inv2", tourTitle: "Serengeti Safari", date: "2026-09-02", capacity: 6, bookedCount: 1, guideAssigned: "Peter Kamau", driverAssigned: "Samuel Njoroge", vehicle: "Land Cruiser TZ 118C" },
  { id: "inv3", tourTitle: "Marrakech & Sahara Desert", date: "2026-10-05", capacity: 12, bookedCount: 6, guideAssigned: undefined, driverAssigned: undefined, vehicle: undefined },
  { id: "inv4", tourTitle: "Pyramids of Giza Tour", date: "2026-07-28", capacity: 15, bookedCount: 2, guideAssigned: "TBD", driverAssigned: undefined, vehicle: undefined },
];
