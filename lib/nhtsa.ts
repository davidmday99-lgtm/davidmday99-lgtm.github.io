export type VinDecodeResult = { vin: string; make?: string; model?: string; modelYear?: number; bodyClass?: string; fuelType?: string; source: 'NHTSA vPIC'; retrievedAt: string; raw: unknown };

export async function decodeVin(vin: string): Promise<VinDecodeResult> {
  const normalized = vin.trim().toUpperCase();
  if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(normalized)) throw new Error('VIN must contain 17 valid characters');
  const base = process.env.NHTSA_VPIC_BASE_URL ?? 'https://vpic.nhtsa.dot.gov/api';
  const response = await fetch(`${base}/vehicles/DecodeVinValuesExtended/${encodeURIComponent(normalized)}?format=json`, { headers: { Accept: 'application/json' }, next: { revalidate: 86400 } });
  if (!response.ok) throw new Error('VIN decoder is temporarily unavailable');
  const body = await response.json() as { Results?: Array<Record<string, string>> };
  const record = body.Results?.[0];
  if (!record) throw new Error('VIN decoder returned no usable record');
  return { vin: normalized, make: record.Make || undefined, model: record.Model || undefined, modelYear: Number(record.ModelYear) || undefined, bodyClass: record.BodyClass || undefined, fuelType: record.FuelTypePrimary || undefined, source: 'NHTSA vPIC', retrievedAt: new Date().toISOString(), raw: body };
}
