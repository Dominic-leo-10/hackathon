// Types for the disaster management system
export type DisasterType = "flood" | "cyclone" | "earthquake" | "tsunami";
export type SeverityLevel = "low" | "moderate" | "severe";
export type ShelterStatus = "open" | "nearly-full" | "full" | "closed";
export type HealthStatus = "critical" | "injured" | "healthy";
export type VulnerabilityType = "child" | "pregnant" | "elderly" | "disabled" | "none";
export type RoleType = "doctor" | "nurse" | "citizen";
export type RiskLevel = "low" | "medium" | "high";
export type AccessType = "road" | "boat" | "air";
export type PriorityCategory = "immediate" | "delayed" | "monitor";

export interface DashboardStats {
  totalAffected: number;
  womenCount: number;
  childrenCount: number;
  injuredCount: number;
  criticalPatients: number;
  availableShelterCapacity: number;
  totalShelters: number;
  totalHospitals: number;
}

export interface Alert {
  id: string;
  type: "critical" | "warning" | "stable";
  title: string;
  description: string;
  location: string;
  timestamp: Date;
}

export interface Shelter {
  id: string;
  name: string;
  type: "school" | "college" | "community-hall" | "stadium";
  latitude: number;
  longitude: number;
  area: number; // in sq ft
  floors: number;
  maxCapacity: number;
  currentOccupancy: number;
  status: ShelterStatus;
  womenChildFriendly: boolean;
  district: string;
  address: string;
}

export interface Hospital {
  id: string;
  name: string;
  location: string;
  district: string;
  totalBeds: number;
  availableBeds: number;
  icuTotal: number;
  icuAvailable: number;
  oxygenAvailable: boolean;
  criticalPatients: number;
  ambulancesAvailable: number;
  contactNumber: string;
}

export interface RescueTeam {
  id: string;
  name: string;
  type: "ndrf" | "sdrf" | "army" | "navy" | "coast-guard";
  members: number;
  status: "available" | "deployed" | "standby";
  location: string;
  equipment: string[];
}

export interface RescueMission {
  id: string;
  zone: string;
  priority: "high" | "medium" | "low";
  assignedTeams: string[];
  accessType: AccessType;
  feasibility: "feasible" | "risky" | "not-recommended";
  estimatedLives: number;
  status: "planned" | "in-progress" | "completed";
}

// Mock Data
export const mockDashboardStats: DashboardStats = {
  totalAffected: 156432,
  womenCount: 48230,
  childrenCount: 32156,
  injuredCount: 3847,
  criticalPatients: 234,
  availableShelterCapacity: 12500,
  totalShelters: 47,
  totalHospitals: 23,
};

export const mockAlerts: Alert[] = [
  {
    id: "1",
    type: "critical",
    title: "Medical Capacity Critical",
    description: "District Hospital Patna ICU at 95% capacity",
    location: "Patna, Bihar",
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
  },
  {
    id: "2",
    type: "critical",
    title: "Shelter Overflow Risk",
    description: "Gandhi Stadium shelter nearing maximum capacity",
    location: "Muzaffarpur, Bihar",
    timestamp: new Date(Date.now() - 32 * 60 * 1000),
  },
  {
    id: "3",
    type: "warning",
    title: "Road Access Blocked",
    description: "NH-28 submerged, alternate route via SH-73",
    location: "Darbhanga, Bihar",
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
  },
  {
    id: "4",
    type: "warning",
    title: "Supply Shortage Alert",
    description: "Medical supplies running low at relief camp",
    location: "Samastipur, Bihar",
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
  },
  {
    id: "5",
    type: "stable",
    title: "Evacuation Complete",
    description: "Zone B-7 evacuation successfully completed",
    location: "Begusarai, Bihar",
    timestamp: new Date(Date.now() - 90 * 60 * 1000),
  },
  {
    id: "6",
    type: "stable",
    title: "Power Restored",
    description: "Grid power restored to relief center",
    location: "Khagaria, Bihar",
    timestamp: new Date(Date.now() - 120 * 60 * 1000),
  },
];

export const mockShelters: Shelter[] = [
  {
    id: "s1",
    name: "Gandhi Memorial School",
    type: "school",
    latitude: 25.6093,
    longitude: 85.1376,
    area: 45000,
    floors: 3,
    maxCapacity: 850,
    currentOccupancy: 720,
    status: "nearly-full",
    womenChildFriendly: true,
    district: "Patna",
    address: "Bailey Road, Patna - 800001",
  },
  {
    id: "s2",
    name: "Patna University Campus",
    type: "college",
    latitude: 25.6022,
    longitude: 85.0921,
    area: 120000,
    floors: 4,
    maxCapacity: 2200,
    currentOccupancy: 1450,
    status: "open",
    womenChildFriendly: true,
    district: "Patna",
    address: "Ashok Rajpath, Patna - 800005",
  },
  {
    id: "s3",
    name: "Moin-ul-Haq Stadium",
    type: "stadium",
    latitude: 25.5941,
    longitude: 85.1376,
    area: 250000,
    floors: 1,
    maxCapacity: 5000,
    currentOccupancy: 4800,
    status: "nearly-full",
    womenChildFriendly: true,
    district: "Patna",
    address: "Patna Junction Area, Patna - 800004",
  },
  {
    id: "s4",
    name: "Muzaffarpur Town Hall",
    type: "community-hall",
    latitude: 26.1209,
    longitude: 85.3647,
    area: 25000,
    floors: 2,
    maxCapacity: 400,
    currentOccupancy: 400,
    status: "full",
    womenChildFriendly: false,
    district: "Muzaffarpur",
    address: "Civil Lines, Muzaffarpur - 842001",
  },
  {
    id: "s5",
    name: "Darbhanga Engineering College",
    type: "college",
    latitude: 26.1542,
    longitude: 85.8918,
    area: 85000,
    floors: 4,
    maxCapacity: 1600,
    currentOccupancy: 890,
    status: "open",
    womenChildFriendly: true,
    district: "Darbhanga",
    address: "Laheriasarai, Darbhanga - 846001",
  },
  {
    id: "s6",
    name: "Samastipur Relief Center",
    type: "community-hall",
    latitude: 25.8628,
    longitude: 85.7811,
    area: 18000,
    floors: 1,
    maxCapacity: 300,
    currentOccupancy: 0,
    status: "closed",
    womenChildFriendly: true,
    district: "Samastipur",
    address: "Station Road, Samastipur - 848101",
  },
];

export const mockHospitals: Hospital[] = [
  {
    id: "h1",
    name: "PMCH Patna",
    location: "Ashok Rajpath",
    district: "Patna",
    totalBeds: 2500,
    availableBeds: 180,
    icuTotal: 120,
    icuAvailable: 8,
    oxygenAvailable: true,
    criticalPatients: 89,
    ambulancesAvailable: 12,
    contactNumber: "0612-2300343",
  },
  {
    id: "h2",
    name: "IGIMS Hospital",
    location: "Sheikhpura",
    district: "Patna",
    totalBeds: 1200,
    availableBeds: 95,
    icuTotal: 60,
    icuAvailable: 12,
    oxygenAvailable: true,
    criticalPatients: 34,
    ambulancesAvailable: 8,
    contactNumber: "0612-2297631",
  },
  {
    id: "h3",
    name: "SKMCH Muzaffarpur",
    location: "Khabra",
    district: "Muzaffarpur",
    totalBeds: 800,
    availableBeds: 45,
    icuTotal: 40,
    icuAvailable: 3,
    oxygenAvailable: false,
    criticalPatients: 28,
    ambulancesAvailable: 5,
    contactNumber: "0621-2240632",
  },
  {
    id: "h4",
    name: "DMCH Darbhanga",
    location: "Laheriasarai",
    district: "Darbhanga",
    totalBeds: 1000,
    availableBeds: 120,
    icuTotal: 50,
    icuAvailable: 15,
    oxygenAvailable: true,
    criticalPatients: 22,
    ambulancesAvailable: 7,
    contactNumber: "06272-222315",
  },
  {
    id: "h5",
    name: "Sadar Hospital Samastipur",
    location: "Civil Lines",
    district: "Samastipur",
    totalBeds: 300,
    availableBeds: 65,
    icuTotal: 15,
    icuAvailable: 6,
    oxygenAvailable: true,
    criticalPatients: 8,
    ambulancesAvailable: 3,
    contactNumber: "06274-222456",
  },
];

export const mockRescueTeams: RescueTeam[] = [
  {
    id: "t1",
    name: "NDRF Battalion 9",
    type: "ndrf",
    members: 45,
    status: "deployed",
    location: "Patna",
    equipment: ["Boats", "Life Jackets", "Medical Kits", "Communication Equipment"],
  },
  {
    id: "t2",
    name: "SDRF Team Alpha",
    type: "sdrf",
    members: 30,
    status: "available",
    location: "Muzaffarpur",
    equipment: ["Rescue Boats", "Ropes", "First Aid"],
  },
  {
    id: "t3",
    name: "Indian Army 23rd Engineers",
    type: "army",
    members: 100,
    status: "deployed",
    location: "Darbhanga",
    equipment: ["Pontoon Bridges", "Heavy Machinery", "Helicopters"],
  },
  {
    id: "t4",
    name: "NDRF Battalion 4",
    type: "ndrf",
    members: 45,
    status: "standby",
    location: "Begusarai",
    equipment: ["Boats", "Life Jackets", "Diving Equipment"],
  },
  {
    id: "t5",
    name: "Coast Guard Unit Delta",
    type: "coast-guard",
    members: 25,
    status: "available",
    location: "Khagaria",
    equipment: ["Speed Boats", "Rescue Equipment", "Medical Supplies"],
  },
];

export const mockZones = [
  { id: "z1", name: "Zone A-1 (Patna East)", severity: "severe", affectedPopulation: 25000 },
  { id: "z2", name: "Zone A-2 (Patna West)", severity: "moderate", affectedPopulation: 18000 },
  { id: "z3", name: "Zone B-1 (Muzaffarpur)", severity: "severe", affectedPopulation: 32000 },
  { id: "z4", name: "Zone B-2 (Darbhanga)", severity: "moderate", affectedPopulation: 21000 },
  { id: "z5", name: "Zone C-1 (Samastipur)", severity: "low", affectedPopulation: 8500 },
];

// Priority Score Calculator
export function calculatePriorityScore(
  health: HealthStatus,
  vulnerability: VulnerabilityType,
  role: RoleType,
  risk: RiskLevel
): { score: number; category: PriorityCategory; breakdown: { factor: string; points: number }[] } {
  const breakdown: { factor: string; points: number }[] = [];

  // Health status points
  const healthPoints = health === "critical" ? 40 : health === "injured" ? 25 : 5;
  breakdown.push({ factor: "Health Status", points: healthPoints });

  // Vulnerability points
  let vulnPoints = 0;
  if (vulnerability === "child") vulnPoints = 30;
  else if (vulnerability === "pregnant") vulnPoints = 35;
  else if (vulnerability === "elderly") vulnPoints = 25;
  else if (vulnerability === "disabled") vulnPoints = 30;
  breakdown.push({ factor: "Vulnerability", points: vulnPoints });

  // Role points (medical personnel get priority for strategic reasons)
  const rolePoints = role === "doctor" ? 20 : role === "nurse" ? 15 : 0;
  breakdown.push({ factor: "Role", points: rolePoints });

  // Risk level points
  const riskPoints = risk === "high" ? 15 : risk === "medium" ? 8 : 0;
  breakdown.push({ factor: "Rescue Risk", points: riskPoints });

  const totalScore = healthPoints + vulnPoints + rolePoints + riskPoints;

  let category: PriorityCategory;
  if (totalScore >= 60) category = "immediate";
  else if (totalScore >= 30) category = "delayed";
  else category = "monitor";

  return { score: totalScore, category, breakdown };
}

// Capacity Calculator
export function calculateCapacity(
  area: number,
  floors: number,
  safetyBuffer: number
): { rawCapacity: number; adjustedCapacity: number } {
  // Assume 50 sq ft per person as standard emergency shelter space
  const sqFtPerPerson = 50;
  const rawCapacity = Math.floor((area * floors) / sqFtPerPerson);
  const adjustedCapacity = Math.floor(rawCapacity * (1 - safetyBuffer / 100));
  return { rawCapacity, adjustedCapacity };
}
