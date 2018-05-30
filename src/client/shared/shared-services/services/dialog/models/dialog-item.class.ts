import {ComponentRef} from '@angular/core';
import {DialogService} from '../dialog.service';
import {DialogComponent} from '../../../../shared-components/components/dialog/dialog.component';

export class DialogItem {
    get close$() {
        return this._componentRef.instance.closed.asObservable();
    }

    get reject$() {
        return this._componentRef.instance.reject.asObservable();
    }

    get resolve$() {
        return this._componentRef.instance.resolve.asObservable();
    }

    get componentRef() {
        return this._componentRef;
    }

    constructor(private _dialogService: DialogService,
                private _componentRef: ComponentRef<DialogComponent>) {

    }

    close() {
        if (this._dialogService) {
            this._dialogService.close(this);
        }
    }

    destroy() {
        this.close();

        if (this._componentRef) {
            this._componentRef.destroy();
            this._componentRef = null;
        }
        this._dialogService = null;
    }
}