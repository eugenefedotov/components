import {ComponentRef, Injectable} from '@angular/core';
import {PopUpItem} from './models/pop-up-item.class';
import {BehaviorSubject, Observable} from 'rxjs';
import {share} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class PopUpService {
    private _i = 0;
    private _stack$: BehaviorSubject<PopUpItem[]> = new BehaviorSubject([]);

    get stack$(): Observable<PopUpItem[]> {
        return this._stack$.pipe(share());
    }

    private get stack(): PopUpItem[] {
        return [...this._stack$.value];
    }

    private set stack(stack: PopUpItem[]) {
        this._stack$.next(stack);
    }

    constructor() {
    }

    open(componentRef: ComponentRef<any>): PopUpItem {
        const item = new PopUpItem(this, ++this._i, componentRef);
        this.stack = [...this.stack, item];
        return item;
    }

    close(componentRef: ComponentRef<any>) {
        const item = this.stack.find(it => it.componentRef === componentRef);

        if (item) {
            this.stack = this.stack.filter(it => it !== item);
            item.destroy();
        }
    }
}
