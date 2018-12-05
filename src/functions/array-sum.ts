/**
 * Быстрая альтернатива reduce
 * http://jsperf.com/array-summation
 */
export function arraySum(array: number[], offsetStart: number, offsetEnd: number): number {
    if (offsetEnd < 0 || offsetStart < 0) {
        console.error(array, offsetEnd, offsetStart);
        return 0;
    }

    const arr = array.slice(offsetStart, offsetEnd);
    let sum = 0;
    for (let i = arr.length; i--;) {
        sum += arr.shift();
    }
    return sum;
}
