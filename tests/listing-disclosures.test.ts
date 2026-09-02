import { describe, expect, it } from 'vitest';

import {
  conditionQuestionCount,
  conditionQuestionGroups,
  getListingDisclosure,
} from '@/lib/listing-disclosures';

describe('listing disclosures', () => {
  it('keeps every condition question uniquely addressable', () => {
    const ids = conditionQuestionGroups.flatMap((group) =>
      group.questions.map((question) => question.id),
    );

    expect(ids).toHaveLength(conditionQuestionCount);
    expect(new Set(ids).size).toBe(ids.length);
    expect(conditionQuestionCount).toBeGreaterThanOrEqual(15);
  });

  it('provides populated public disclosures without empty feature rows', () => {
    const disclosure = getListingDisclosure('2021-midsize-touring-crossover');

    expect(disclosure.condition.length).toBeGreaterThanOrEqual(5);
    expect(disclosure.condition.every((group) => group.items.length > 0)).toBe(true);
    expect(disclosure.features.every((group) => group.items.length > 0)).toBe(true);
  });

  it('uses a complete fallback for other demonstration listings', () => {
    const disclosure = getListingDisclosure('another-demo');

    expect(disclosure.seller.identity).toMatch(/ID/i);
    expect(disclosure.features.flatMap((group) => group.items)).toContain('Backup camera');
  });
});
