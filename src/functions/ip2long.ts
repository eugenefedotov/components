const multipliers = [0x1000000, 0x10000, 0x100, 1];

export function ip2long(ip: string): number {
    let longValue = 0;
    ip.split('.').forEach(function (part, i) {
        longValue += part * multipliers[i];
    });
    return longValue;
}

export function long2ip(longValue: number): string {
    return multipliers.map(function (multiplier) {
        return Math.floor((longValue % (multiplier * 0x100)) / multiplier);
    }).join('.');
}