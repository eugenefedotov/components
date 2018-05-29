import {TemplateRef} from '@angular/core';
import {PopUpOptionsModel} from './pop-up-options.model';
import {PopUpService} from '../pop-up.service';

export class PopUpItem {
    constructor(private service: PopUpService,
                readonly id: number,
                private templateRef: TemplateRef<any>,
                private options?: PopUpOptionsModel) {

    }

    close() {
        if (this.service) {
            this.service.close(this);
        }
    }

    destroy() {
        this.close();

        this.service = null;
        this.templateRef = null;
        this.options = null;
    }
}