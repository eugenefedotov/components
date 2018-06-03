import {ComponentFactoryResolver, ComponentRef, Injectable, Injector, TemplateRef, Type} from '@angular/core';
import {WindowComponent} from '../../../shared-components/components/base/window/window.component';
import {PopUpService} from '../pop-up/pop-up.service';
import {WindowStyleEnum} from '../../../shared-components/components/base/window/models/window-style.enum';

@Injectable({
    providedIn: 'root'
})
export class WindowService {

    constructor(private resolver: ComponentFactoryResolver,
                private injector: Injector,
                private popUpService: PopUpService) {
    }

    open(headerText: string, contentTemplate: TemplateRef<any>, footerTemplate: TemplateRef<any>, windowStyle = WindowStyleEnum.Neutral) {
        const componentRef = this.createComponent(WindowComponent);
        const window = componentRef.instance;

        window.windowStyle = windowStyle;
        window.headerText = headerText;
        window.contentTemplate = contentTemplate;
        window.footerTemplate = footerTemplate;

        window.closeClick.subscribe(() => componentRef.destroy());

        this.popUpService.insertComponent(componentRef);

        return componentRef;
    }

    private createComponent<T>(comp: Type<T>): ComponentRef<T> {
        const factory = this.resolver.resolveComponentFactory(comp);
        return factory.create(this.injector);
    }
}
