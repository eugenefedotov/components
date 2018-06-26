import {Component, OnInit} from '@angular/core';
import {DEMO_COMPONENTS} from '../demo.components';

@Component({
    selector: 'app-demo-showcase',
    templateUrl: './showcase.component.html',
    styleUrls: ['./showcase.component.scss']
})
export class ShowcaseComponent implements OnInit {

    components = DEMO_COMPONENTS;

    constructor() {
    }

    ngOnInit() {
    }

}
