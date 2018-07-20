/**
 * Расчет суммы комиссии
 * @param {number} sum сумма, относительно которой будет рассчитываться процент от комиссии
 * @param {number} percent процент от суммы
 * @param {boolean} byTargetSum расчет комиссии относительно итоговой суммы
 * @returns {number}
 */
export function calculateFeeFunction(sum: number, percent: number, byTargetSum = false): number {
  if (byTargetSum) {
    return sum / (100 + percent) * percent;
  } else {
    return sum * percent / 100;
  }
}
