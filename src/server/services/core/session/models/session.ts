import {Subject} from 'rxjs';

export class Session {
    readonly destroy$ = new Subject();
    readonly data = new Map<string, any>();

    constructor(readonly id: string,
                readonly userId: number) {
    }

    destroy() {
        if (this.destroy$.isStopped) {
            return;
        }
        this.destroy$.next();
        this.destroy$.complete();
        this.doDestroy();
    }

    private doDestroy() {
        this.data.clear();
    }
}