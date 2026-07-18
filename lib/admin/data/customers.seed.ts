export interface Customer {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  nationality: string;
  emergencyContact: string;
  notes: string;
  loyaltyPoints: number;
  createdAt: string;
}

export const seedCustomers: Customer[] = [
  { id: "c1", fullName: "Amara Okafor", email: "amara.okafor@example.com", phone: "+234 803 555 0101", nationality: "Nigerian", emergencyContact: "Chidi Okafor, +234 803 555 0199", notes: "Prefers window seats on game drives.", loyaltyPoints: 320, createdAt: "2026-01-14" },
  { id: "c2", fullName: "Daniel Kessler", email: "daniel.kessler@example.com", phone: "+49 170 555 0110", nationality: "German", emergencyContact: "Lena Kessler, +49 170 555 0111", notes: "Vegetarian, travels with a DSLR kit.", loyaltyPoints: 150, createdAt: "2026-02-02" },
  { id: "c3", fullName: "Priya Sharma", email: "priya.sharma@example.com", phone: "+91 98200 55011", nationality: "Indian", emergencyContact: "Raj Sharma, +91 98200 55012", notes: "Booked as part of a group of 6.", loyaltyPoints: 480, createdAt: "2026-03-21" },
  { id: "c4", fullName: "Michael Thompson", email: "michael.t@example.com", phone: "+1 415 555 0142", nationality: "American", emergencyContact: "Sarah Thompson, +1 415 555 0143", notes: "First-time safari traveler.", loyaltyPoints: 60, createdAt: "2026-04-09" },
  { id: "c5", fullName: "Fatima Al-Sayed", email: "fatima.alsayed@example.com", phone: "+20 100 555 0177", nationality: "Egyptian", emergencyContact: "Omar Al-Sayed, +20 100 555 0178", notes: "Returning customer, 3rd booking.", loyaltyPoints: 890, createdAt: "2025-11-30" },
];

