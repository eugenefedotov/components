import {calculateFeeFunction} from './calculate-fee.function';

/**
 * расчет итоговой суммы после вычета комиссии платежной системы
 */
export function calculateTargetSum(sourceSum: number, fee: { fixed: number, percent: number }): number {
    if (fee.percent) {
        sourceSum -= calculateFeeFunction(sourceSum, fee.percent);
    }

    if (fee.fixed) {
        sourceSum -= fee.fixed;
    }

    return sourceSum;
}
