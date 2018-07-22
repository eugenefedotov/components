import {calculateFee} from './calculate.fee';
import {BigNumber} from 'bignumber.js';

/**
 * расчет итоговой суммы после вычета комиссии платежной системы
 */
export function calculateTargetSum(sourceSum: number, fee: { fixed: number, percent: number }): number {
    if (fee.percent) {
        sourceSum = new BigNumber(sourceSum).minus(calculateFee(sourceSum, fee.percent)).toNumber();;
    }

    if (fee.fixed) {
        sourceSum = new BigNumber(sourceSum).minus(fee.fixed).toNumber();
    }

    return sourceSum;
}
