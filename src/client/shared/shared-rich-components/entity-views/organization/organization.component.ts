import {Component, Input, OnInit} from '@angular/core';
import {OrganizationEntity} from '../../../../../dao/content/organization/organization.entity';

@Component({
    selector: 'app-organization',
    templateUrl: './organization.component.html',
    styleUrls: ['./organization.component.scss']
})
export class OrganizationComponent implements OnInit {

    @Input() id: number;
    @Input() organization: OrganizationEntity;

    constructor() {
    }

    ngOnInit() {
    }

}
