/**
 * Получение индекса элемента, на котором накопленная сумма элементов >= требуемой сумме
 */
export function arraySumIndex(array: number[], sum: number, nextIfExists = false): number {
    let i;
    let sumInner = 0;

    for (i = 0; i < array.length; i++) {
        sumInner += array[i];

        if (sumInner >= sum) {
            break;
        }
    }

    const nextOffset = (nextIfExists && i < array.length ? 1 : 0);

    return i + nextOffset;
}
