import {Injectable, TemplateRef} from '@angular/core';
import {PopUpService} from '../pop-up/pop-up.service';
import {WindowStyleEnum} from '../../shared-components/window/models/window-style.enum';
import {WindowComponent} from '../../shared-components/window/window.component';
import {ComponentFactoryService} from '../component-factory/component-factory.service';

@Injectable({
    providedIn: 'root'
})
export class WindowService {

    constructor(private componentFactoryService: ComponentFactoryService,
                private popUpService: PopUpService) {
    }

    open(headerText: string, contentTemplate: TemplateRef<any>, footerTemplate: TemplateRef<any>, windowStyle = WindowStyleEnum.Neutral) {
        const componentRef = this.componentFactoryService.createComponent(WindowComponent);
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
