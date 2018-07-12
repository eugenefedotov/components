import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-block-wrapper',
    templateUrl: './block-wrapper.component.html',
    styleUrls: ['./block-wrapper.component.scss']
})
export class BlockWrapperComponent implements OnInit {

    @Input()
    title: string;

    constructor() {
    }

    ngOnInit() {
    }

}
