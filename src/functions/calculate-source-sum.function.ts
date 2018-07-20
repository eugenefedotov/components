import {calculateFeeFunction} from './calculate-fee.function';

/**
 * расчет необходимой суммы с учетом комиссии, чтобы получить итоговую
 */
export function calculateSourceSum(targetSum: number, fee: { fixed: number, percent: number }): number {
    if (fee.fixed) {
        targetSum += fee.fixed;
    }

    if (fee.percent) {
        targetSum += calculateFeeFunction(targetSum, fee.percent, true);
    }

    return targetSum;
}
