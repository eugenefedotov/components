export function arrayEquals(array1: any[], array2: any[]): boolean {
    if (!array1 || !array2) {
        return false;
    }
    if (array1.length !== array2.length) {
        return false;
    }
    const l = array1.length;
    for (let i = 0; i < l; i++) {
        if (array1[i] instanceof Array && array2[i] instanceof Array) {
            if (!arrayEquals(array1[i], array2[i])) {
                return false;
            }
        } else if (array1[i] !== array2[i]) {
            return false;
        }
    }
    return true;
}
