import {Component, OnInit} from '@angular/core';
import {BreadcrumbModel} from './breadcrumb.model';

@Component({
    selector: 'app-breadcrumbs',
    templateUrl: './breadcrumbs.component.html',
    styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent implements OnInit {

    items: BreadcrumbModel[];

    constructor() {
    }

    ngOnInit() {
    }

}
