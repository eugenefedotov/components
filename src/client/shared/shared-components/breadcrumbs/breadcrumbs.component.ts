import {Component, Input, OnInit} from '@angular/core';
import {BreadcrumbModel} from '../../shared-models/breadcrumb.model';

@Component({
    selector: 'app-breadcrumbs',
    templateUrl: './breadcrumbs.component.html',
    styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent implements OnInit {

    @Input()
    items: BreadcrumbModel[];

    constructor() {
    }

    ngOnInit() {
    }

}
