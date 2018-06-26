import {Injectable} from '@angular/core';
import {PopUpService} from '../pop-up/pop-up.service';
import {first} from 'rxjs/operators';
import {WindowStyleEnum} from '../../shared-components/window/models/window-style.enum';
import {DialogComponent} from '../../shared-components/dialog/dialog.component';
import {ComponentFactoryService} from '../component-factory/component-factory.service';

@Injectable({
    providedIn: 'root'
})
export class DialogService {

    defaultInfoTitleText = 'Информация';
    defaultConfirmTitleText = 'Подтверждение';
    defaultSuccessTitleText = 'Успешно';
    defaultErrorTitleText = 'Ошибка';

    constructor(private popUpService: PopUpService,
                private componentFactoryService: ComponentFactoryService) {

    }

    async openInfo(text: string, title = this.defaultInfoTitleText): Promise<void> {
        return this.open(title, text).instance.closed.pipe(first()).toPromise();
    }

    async openSuccess(text: string, title = this.defaultSuccessTitleText): Promise<void> {
        return this.open(title, text, WindowStyleEnum.Success).instance.closed.pipe(first()).toPromise();
    }

    async openError(text: string, title = this.defaultErrorTitleText): Promise<void> {
        return this.open(title, text, WindowStyleEnum.Warning).instance.closed.pipe(first()).toPromise();
    }

    async openConfirm(text: string, title = this.defaultConfirmTitleText): Promise<boolean> {
        return new Promise<boolean>(resolve => {
            const item = this.open(title, text, WindowStyleEnum.Confirm);

            item.instance.resolved.pipe(first()).subscribe(() => resolve(true));
            item.instance.rejected.pipe(first()).subscribe(() => resolve(false));
            item.changeDetectorRef.detectChanges();
        });
    }

    private open(headerText: string, contentText: string, windowStyle = WindowStyleEnum.Neutral) {
        const componentRef = this.componentFactoryService.createComponent(DialogComponent);

        const dialogComponent = componentRef.instance;
        dialogComponent.windowStyle = windowStyle;
        dialogComponent.headerText = headerText;
        dialogComponent.contentText = contentText;

        dialogComponent.closed.pipe(first()).subscribe(() => componentRef.destroy());
        componentRef.changeDetectorRef.detectChanges();

        this.popUpService.insertComponent(componentRef, true);

        return componentRef;
    }
}
