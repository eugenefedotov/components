import {Injectable, TemplateRef} from '@angular/core';
import {PopUpItem} from './models/pop-up-item.class';
import {PopUpOptionsModel} from './models/pop-up-options.model';
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

    open(templateRef: TemplateRef<any>, options?: PopUpOptionsModel): PopUpItem {
        const item = new PopUpItem(this, ++this._i, templateRef, options);
        this.stack = [...this.stack, item];
        return item;
    }

    close(item: PopUpItem) {
        this.stack = this.stack.filter(_item => _item !== item);
        item.destroy();
    }
}
