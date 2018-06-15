import {Injectable, TemplateRef} from '@angular/core';
import {WindowComponent} from '../../../shared-components/components/base/window/window.component';
import {PopUpService} from '../pop-up/pop-up.service';
import {WindowStyleEnum} from '../../../shared-components/components/base/window/models/window-style.enum';

@Injectable({
    providedIn: 'root'
})
export class WindowService {

    constructor(private popUpService: PopUpService) {
    }

    open(headerText: string, contentTemplate: TemplateRef<any>, footerTemplate: TemplateRef<any>, windowStyle = WindowStyleEnum.Neutral) {
        const componentRef = this.popUpService.createComponent(WindowComponent);
        const window = componentRef.instance;

        window.windowStyle = windowStyle;
        window.headerText = headerText;
        window.contentTemplate = contentTemplate;
        window.footerTemplate = footerTemplate;

        window.closeClick.subscribe(() => componentRef.destroy());

        this.popUpService.insertComponent(componentRef);

        return componentRef;
    }
}
