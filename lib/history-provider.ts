export type VehicleHistorySummary = { vin: string; status: 'mock-unavailable' | 'available'; retrievedAt?: string; source: string; disclaimer: string };

export interface VehicleHistoryProvider { getSummary(vin: string): Promise<VehicleHistorySummary>; }

export class MockNmvtisProvider implements VehicleHistoryProvider {
  async getSummary(vin: string): Promise<VehicleHistorySummary> {
    return { vin, status: 'mock-unavailable', source: 'Mock adapter — no NMVTIS data retrieved', disclaimer: 'No vehicle-history result is displayed until an approved NMVTIS provider agreement and credentials are supplied. NMVTIS reports do not contain complete repair histories.' };
  }
}
