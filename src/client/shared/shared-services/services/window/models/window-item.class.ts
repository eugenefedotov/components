import {WindowComponent} from '../../../../shared-components/components/window/window.component';
import {ComponentRef, EventEmitter} from '@angular/core';
import {WindowService} from '../window.service';

export class WindowItem {
    private _onClose = new EventEmitter();

    get onClose() {
        return this._onClose.asObservable();
    }

    get componentRef() {
        return this._componentRef;
    }

    constructor(private _windowService: WindowService,
                private _componentRef: ComponentRef<WindowComponent>) {

    }

    close() {
        if (this._windowService) {
            this._onClose.emit();
            this._onClose.complete();
            this._windowService.close(this);
        }
    }

    destroy() {
        this.close();

        if (this._componentRef) {
            this._componentRef.destroy();
            this._componentRef = null;
        }
        this._windowService = null;
        this._onClose = null;
    }
}