/**
 * Быстрая альтернатива reduce
 * http://jsperf.com/array-summation
 */
export function arraySum(array: number[]): number {
    return array.reduce((a, b) => a + b, 0);
}
