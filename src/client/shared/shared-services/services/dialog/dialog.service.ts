import {ComponentFactoryResolver, ComponentRef, Injectable, Injector, Type} from '@angular/core';
import {PopUpService} from '../pop-up/pop-up.service';
import {DialogComponent} from '../../../shared-components/components/dialog/dialog.component';
import {DialogItem} from './models/dialog-item.class';
import {WindowStyleEnum} from '../../../shared-components/components/window/models/window-style.enum';

@Injectable({
    providedIn: 'root'
})
export class DialogService {

    defaultInfoTitleText = '';
    defaultConfirmTitleText = '';
    defaultSuccessTitleText = '';
    defaultErrorTitleText = '';

    constructor(private resolver: ComponentFactoryResolver,
                private injector: Injector,
                private popUpService: PopUpService) {

    }

    async openInfo(text: string, title = this.defaultInfoTitleText): Promise<void> {
        return this.open(title, text).close$.toPromise();
    }

    async openSuccess(text: string, title = this.defaultSuccessTitleText): Promise<void> {
        return this.open(title, text, WindowStyleEnum.Success).close$.toPromise();
    }

    async openError(text: string, title = this.defaultErrorTitleText): Promise<void> {
        return this.open(title, text, WindowStyleEnum.Warning).close$.toPromise();
    }

    async openConfirm(text: string, title = this.defaultConfirmTitleText): Promise<boolean> {
        return new Promise<boolean>(resolve => {
            const item = this.open(title, text, WindowStyleEnum.Confirm);

            item.resolve$.subscribe(() => resolve(true));
            item.reject$.subscribe(() => resolve(false));
        });
    }

    private open(headerText: string, contentText: string, windowStyle = WindowStyleEnum.Neutral): DialogItem {
        const componentRef = this.createComponent(DialogComponent);
        const dialogComponent = componentRef.instance;
        dialogComponent.windowStyle = windowStyle;
        dialogComponent.headerText = headerText;
        dialogComponent.contentText = contentText;

        const item = new DialogItem(this, componentRef);

        dialogComponent.closed.subscribe(() => item.close());

        this.popUpService.open(componentRef);

        return item;
    }

    close(item: DialogItem) {
        this.popUpService.close(item.componentRef);
        item.destroy();
    }

    private createComponent<T>(comp: Type<T>): ComponentRef<T> {
        const factory = this.resolver.resolveComponentFactory(comp);
        return factory.create(this.injector);
    }
}
