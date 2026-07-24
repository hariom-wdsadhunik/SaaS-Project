import { PropertyEntity, PropertyFilterState } from "@/domain/property/types";
import { platformAuditLogger } from "@/platform/audit";

export const initialPropertiesDataset: PropertyEntity[] = [
  {
    id: "prop-101",
    mlsId: "MLS-99401",
    title: "The Sky Penthouse at Palm Tower",
    address: "Palm Jumeirah East Crescent",
    city: "Dubai",
    state: "Dubai",
    zipCode: "00000",
    price: 4250000,
    bedrooms: 4,
    bathrooms: 5,
    areaSqFt: 5200,
    propertyType: "PENTHOUSE",
    status: "AVAILABLE",
    coverImageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
    assignedAgentName: "Alex Morgan",
    agentAvatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    yearBuilt: 2024,
    createdAt: "2026-07-01T10:00:00Z",
    updatedAt: "2026-07-22T14:30:00Z",
  },
  {
    id: "prop-102",
    mlsId: "MLS-99402",
    title: "Modern Minimalist Beachfront Villa",
    address: "Jumeirah Beach Road 12",
    city: "Dubai",
    state: "Dubai",
    zipCode: "00000",
    price: 6800000,
    bedrooms: 6,
    bathrooms: 7,
    areaSqFt: 8400,
    propertyType: "VILLA",
    status: "RESERVED",
    coverImageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    assignedAgentName: "Sarah Jenkins",
    agentAvatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150",
    yearBuilt: 2023,
    createdAt: "2026-06-15T11:00:00Z",
    updatedAt: "2026-07-20T09:15:00Z",
  },
  {
    id: "prop-103",
    mlsId: "MLS-99403",
    title: "Downtown Luxury Executive Suite",
    address: "Boulevard Plaza Tower 1",
    city: "Dubai",
    state: "Dubai",
    zipCode: "00000",
    price: 1850000,
    bedrooms: 2,
    bathrooms: 2.5,
    areaSqFt: 1850,
    propertyType: "APARTMENT",
    status: "AVAILABLE",
    coverImageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
    assignedAgentName: "Michael Chen",
    agentAvatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    yearBuilt: 2022,
    createdAt: "2026-07-10T15:20:00Z",
    updatedAt: "2026-07-23T11:00:00Z",
  },
  {
    id: "prop-104",
    mlsId: "MLS-99404",
    title: "Marina Prime Commercial Retail Unit",
    address: "Marina Promenade Walk",
    city: "Dubai",
    state: "Dubai",
    zipCode: "00000",
    price: 1200000,
    bedrooms: 0,
    bathrooms: 2,
    areaSqFt: 2100,
    propertyType: "COMMERCIAL",
    status: "SOLD",
    coverImageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
    assignedAgentName: "Alex Morgan",
    yearBuilt: 2021,
    createdAt: "2026-05-20T08:30:00Z",
    updatedAt: "2026-07-18T16:45:00Z",
  },
  {
    id: "prop-105",
    mlsId: "MLS-99405",
    title: "Highland Heights Duplex Loft",
    address: "DIFC Gate Precinct 4",
    city: "Dubai",
    state: "Dubai",
    zipCode: "00000",
    price: 2450000,
    bedrooms: 3,
    bathrooms: 3.5,
    areaSqFt: 2900,
    propertyType: "DUPLEX",
    status: "AVAILABLE",
    coverImageUrl: "https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=800",
    assignedAgentName: "Sarah Jenkins",
    yearBuilt: 2024,
    createdAt: "2026-07-18T12:00:00Z",
    updatedAt: "2026-07-24T08:00:00Z",
  },
];

export const propertyMockService = {
  async getProperties(filters?: Partial<PropertyFilterState>): Promise<PropertyEntity[]> {
    await new Promise((res) => setTimeout(res, 200));

    let items = [...initialPropertiesDataset];

    if (filters) {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        items = items.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.address.toLowerCase().includes(q) ||
            p.city.toLowerCase().includes(q) ||
            p.mlsId.toLowerCase().includes(q)
        );
      }
      if (filters.propertyType) {
        items = items.filter((p) => p.propertyType === filters.propertyType);
      }
      if (filters.status) {
        items = items.filter((p) => p.status === filters.status);
      }
      if (filters.city) {
        const targetCity = filters.city.toLowerCase();
        items = items.filter((p) => p.city.toLowerCase() === targetCity);
      }
      if (filters.assignedAgent) {
        items = items.filter((p) => p.assignedAgentName === filters.assignedAgent);
      }
    }

    platformAuditLogger.log({
      action: "UPDATE",
      entityType: "PROPERTY",
      entityIds: items.map((i) => i.id),
      payload: { filterCount: items.length },
      timestamp: new Date().toISOString(),
    });

    return items;
  },
};
