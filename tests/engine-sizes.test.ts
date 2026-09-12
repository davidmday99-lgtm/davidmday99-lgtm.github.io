import { describe, expect, it } from 'vitest';

import { engineSizeSuggestions } from '@/lib/engine-sizes';
import { vehicleTypes } from '@/lib/vehicle-types';

describe('engine size suggestions', () => {
  it('provides valid choices for every listing category', () => {
    for (const type of vehicleTypes) {
      expect(engineSizeSuggestions(type.value).length).toBeGreaterThan(0);
    }
  });

  it('uses units that fit the selected vehicle category', () => {
    expect(engineSizeSuggestions('car')).toContain('3.6L');
    expect(engineSizeSuggestions('motorcycle')).toContain('1000cc');
    expect(engineSizeSuggestions('boat')).toContain('150 hp');
    expect(engineSizeSuggestions('trailer')).toEqual([
      'Not applicable (no engine)',
    ]);
  });
});
