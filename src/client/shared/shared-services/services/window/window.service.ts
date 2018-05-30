import {ComponentFactoryResolver, ComponentRef, Injectable, Injector, TemplateRef, Type} from '@angular/core';
import {WindowItem} from './models/window-item.class';
import {WindowComponent} from '../../../shared-components/components/window/window.component';
import {PopUpService} from '../pop-up/pop-up.service';
import {WindowStyleEnum} from '../../../shared-components/components/window/models/window-style.enum';

@Injectable({
    providedIn: 'root'
})
export class WindowService {

    constructor(private resolver: ComponentFactoryResolver,
                private injector: Injector,
                private popUpService: PopUpService) {
    }

    open(headerText: string, contentTemplate: TemplateRef<any>, footerTemplate: TemplateRef<any>, windowStyle = WindowStyleEnum.Neutral): WindowItem {
        const componentRef = this.createComponent(WindowComponent);
        const window = componentRef.instance;
        window.windowStyle = windowStyle;
        window.headerText = headerText;
        window.contentTemplate = contentTemplate;
        window.footerTemplate = footerTemplate;

        const item = new WindowItem(this, componentRef);

        window.closeButtonClick.subscribe(() => item.close());

        this.popUpService.open(componentRef);

        return item;
    }

    close(item: WindowItem) {
        this.popUpService.close(item.componentRef);
        item.destroy();
    }

    private createComponent<T>(comp: Type<T>): ComponentRef<T> {
        const factory = this.resolver.resolveComponentFactory(comp);
        return factory.create(this.injector);
    }
}
