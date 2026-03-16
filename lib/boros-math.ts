// Tick-to-rate conversion from the Boros SDK
// rate = 1.00005^(tick * tickStep) - 1

export function tickToRate(tick: number, tickStep: number = 1): number {
  return Math.pow(1.00005, tick * tickStep) - 1;
}

export function rateToAPR(rate: number): number {
  return rate * 100;
}

export function tickToAPR(tick: number, tickStep: number = 1): number {
  return rateToAPR(tickToRate(tick, tickStep));
}

export function orderBookToImpliedAPR(
  bestBidTick: number,
  bestAskTick: number,
  tickStep: number = 1
): number {
  const midTick = (bestBidTick + bestAskTick) / 2;
  return tickToAPR(midTick, tickStep);
}
