/*
 * Because of floating point precision we need math helpers
 */

// fraction multiplier
const F_M = 100

export const sum = (val1: number, val2: number) =>
  (val1 * F_M + val2 * F_M) / F_M
