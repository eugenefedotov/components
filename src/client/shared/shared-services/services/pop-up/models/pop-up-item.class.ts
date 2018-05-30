import {ComponentRef} from '@angular/core';
import {PopUpService} from '../pop-up.service';

export class PopUpItem {
    constructor(private _service: PopUpService,
                public componentRef: ComponentRef<any>) {

    }

    close() {
        if (!this._service) {
            return;
        }
        this._service.close(this.componentRef);
    }

    destroy() {
        if (!this._service) {
            return;
        }
        this.close();

        this._service = null;
        this.componentRef = null;
    }
}