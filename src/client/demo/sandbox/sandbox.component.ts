import {Component, OnInit} from '@angular/core';
import {DialogComponent} from '../../shared/shared-components/dialog/dialog.component';

@Component({
    selector: 'app-demo-sandbox',
    templateUrl: './sandbox.component.html',
    styleUrls: ['./sandbox.component.scss']
})
export class SandboxComponent implements OnInit {

    componentType = DialogComponent;

    constructor() {
    }

    ngOnInit() {
    }

}
