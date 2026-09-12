import { describe, expect, it } from 'vitest';

import {
  catalogMakes,
  catalogModels,
  modelYearOptions,
} from '@/lib/vehicle-catalog';
import { vehicleTypes } from '@/lib/vehicle-types';

describe('vehicle catalog', () => {
  it('provides make choices for every marketplace category', () => {
    for (const type of vehicleTypes) {
      expect(catalogMakes(type.value).length).toBeGreaterThan(4);
    }
  });

  it('provides broad car coverage beyond current inventory', () => {
    const makes = catalogMakes('car');
    expect(makes.length).toBeGreaterThan(40);
    expect(makes).toEqual(
      expect.arrayContaining(['Ford', 'Honda', 'Jeep', 'Tesla', 'Toyota']),
    );
    expect(catalogModels('car', 'Toyota')).toEqual(
      expect.arrayContaining(['Camry', 'Highlander', 'Tacoma']),
    );
  });

  it('keeps model choices tied to the selected category and make', () => {
    expect(catalogModels('motorcycle', 'Honda')).toContain('Gold Wing');
    expect(catalogModels('atv_utv', 'Honda')).toContain('Pioneer 1000');
    expect(catalogModels('personal_watercraft', 'Kawasaki')).toContain(
      'Jet Ski Ultra 310',
    );
  });

  it('offers all practical model years newest first', () => {
    const years = modelYearOptions();
    expect(years[0]).toBe(String(new Date().getFullYear() + 1));
    expect(years.at(-1)).toBe('1900');
  });
});
