import * as moment from 'moment';

export function delay(ms: number, log = true): Promise<void> {
    if (log) {
        console.log(`delay: ${moment.duration({ms}).humanize()}`);
    }

    return new Promise(resolve => setTimeout(resolve, ms));
}
