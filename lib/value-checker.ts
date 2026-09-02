export type AskingPricePosition =
  | 'below-range'
  | 'within-range'
  | 'above-range';

export type ValueComparison = {
  low: number;
  high: number;
  midpoint: number;
  spread: number;
  spreadPercent: number;
  askingPrice: number | null;
  askingDifference: number | null;
  askingDifferencePercent: number | null;
  askingPricePosition: AskingPricePosition | null;
};

export function parseDollarInput(value: string) {
  const parsed = Number(value.replace(/[$,\s]/g, ''));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

export function compareVehicleValues(
  kelleyBlueBookValue: string,
  edmundsValue: string,
  askingPrice = '',
): ValueComparison | null {
  const kbb = parseDollarInput(kelleyBlueBookValue);
  const edmunds = parseDollarInput(edmundsValue);
  if (kbb === null || edmunds === null) return null;

  const low = Math.min(kbb, edmunds);
  const high = Math.max(kbb, edmunds);
  const midpoint = (low + high) / 2;
  const spread = high - low;
  const parsedAskingPrice = parseDollarInput(askingPrice);

  let askingPricePosition: AskingPricePosition | null = null;
  if (parsedAskingPrice !== null) {
    askingPricePosition =
      parsedAskingPrice < low
        ? 'below-range'
        : parsedAskingPrice > high
          ? 'above-range'
          : 'within-range';
  }

  return {
    low: Math.round(low),
    high: Math.round(high),
    midpoint: Math.round(midpoint),
    spread: Math.round(spread),
    spreadPercent: Math.round((spread / midpoint) * 100),
    askingPrice: parsedAskingPrice === null ? null : Math.round(parsedAskingPrice),
    askingDifference:
      parsedAskingPrice === null
        ? null
        : Math.round(parsedAskingPrice - midpoint),
    askingDifferencePercent:
      parsedAskingPrice === null
        ? null
        : Math.round(((parsedAskingPrice - midpoint) / midpoint) * 100),
    askingPricePosition,
  };
}

