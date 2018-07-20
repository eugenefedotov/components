import {calculateFee} from './calculate.fee';

/**
 * расчет итоговой суммы после вычета комиссии платежной системы
 */
export function calculateTargetSum(sourceSum: number, fee: { fixed: number, percent: number }): number {
    if (fee.percent) {
        sourceSum -= calculateFee(sourceSum, fee.percent);
    }

    if (fee.fixed) {
        sourceSum -= fee.fixed;
    }

    return sourceSum;
}
