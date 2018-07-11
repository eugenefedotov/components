import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-value-wrapper',
    templateUrl: './value-wrapper.component.html',
    styleUrls: ['./value-wrapper.component.scss']
})
export class ValueWrapperComponent implements OnInit {

    @Input()
    title: string;

    constructor() {
    }

    ngOnInit() {
    }

}
