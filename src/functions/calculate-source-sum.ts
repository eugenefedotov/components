import {calculateFee} from './calculate.fee';
import {BigNumber} from 'bignumber.js';

/**
 * расчет необходимой суммы с учетом комиссии, чтобы получить итоговую
 */
export function calculateSourceSum(targetSum: number, fee: { fixed: number, percent: number }): number {
    if (fee.fixed) {
        targetSum = new BigNumber(targetSum).plus(fee.fixed).toNumber();
    }

    if (fee.percent) {
        targetSum = new BigNumber(targetSum).plus(calculateFee(targetSum, fee.percent, true)).toNumber();
    }

    return targetSum;
}
