export function arrayFillSpaces(arrayWithSpaces: number[], replaceSpace: number, targetLength: number): number[] {
    const arr: number[] = [];
    for (let i = 0; i < targetLength; i++) {
        arr.push(arrayWithSpaces[i] || replaceSpace);
    }
    return arr;
}
