export type AskingPricePosition =
  | 'below-guide'
  | 'matches-guide'
  | 'above-guide';

export type ValueComparison = {
  guideValue: number;
  askingPrice: number | null;
  askingDifference: number | null;
  askingDifferencePercent: number | null;
  askingPricePosition: AskingPricePosition | null;
};

export function parseDollarInput(value: string) {
  const parsed = Number(value.replace(/[$,\s]/g, ''));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

export function compareVehicleValue(
  kelleyBlueBookValue: string,
  askingPrice = '',
): ValueComparison | null {
  const kbb = parseDollarInput(kelleyBlueBookValue);
  if (kbb === null) return null;
  const parsedAskingPrice = parseDollarInput(askingPrice);

  let askingPricePosition: AskingPricePosition | null = null;
  if (parsedAskingPrice !== null) {
    askingPricePosition =
      parsedAskingPrice < kbb
        ? 'below-guide'
        : parsedAskingPrice > kbb
          ? 'above-guide'
          : 'matches-guide';
  }

  return {
    guideValue: Math.round(kbb),
    askingPrice: parsedAskingPrice === null ? null : Math.round(parsedAskingPrice),
    askingDifference:
      parsedAskingPrice === null
        ? null
        : Math.round(parsedAskingPrice - kbb),
    askingDifferencePercent:
      parsedAskingPrice === null
        ? null
        : Math.round(((parsedAskingPrice - kbb) / kbb) * 100),
    askingPricePosition,
  };
}
