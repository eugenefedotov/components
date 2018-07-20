export function checkNumber(number: any) {
    if (Number.isNaN(Number.parseFloat(number))) {
        throw new Error(`not number ${number}`);
    }
}
