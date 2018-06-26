import {DialogComponent} from '../shared/shared-components/dialog/dialog.component';
import {Type} from '@angular/core';

export interface DemoComponentPreset {
    name: string;

    inputs: { [key: string]: any };
}

export interface DemoComponentInfo {
    name: string;
    type: Type<any>;

    presets?: DemoComponentPreset[];
}

export const DEMO_COMPONENTS: DemoComponentInfo[] = [
    {
        name: 'Dialog',
        type: DialogComponent
    }
];
