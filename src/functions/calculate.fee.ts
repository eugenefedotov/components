import {BigNumber} from 'bignumber.js';

/**
 * Расчет суммы комиссии
 * @param {number} sum сумма, относительно которой будет рассчитываться процент от комиссии
 * @param {number} percent процент от суммы
 * @param {boolean} byTargetSum расчет комиссии относительно итоговой суммы
 * @returns {number}
 */
export function calculateFee(sum: number, percent: number, byTargetSum = false): number {
    if (byTargetSum) {
        return new BigNumber(sum).div(100 + percent).times(percent).toNumber();
    } else {
        return new BigNumber(sum).times(percent).div(100).toNumber();
    }
}
