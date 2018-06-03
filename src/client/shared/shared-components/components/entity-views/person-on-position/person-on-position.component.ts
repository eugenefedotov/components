import {Component, Input, OnInit} from '@angular/core';
import {PersonOnPositionEntity} from '../../../../../../dao/content/person-on-position/person-on-position.entity';

@Component({
    selector: 'app-person-on-position',
    templateUrl: './person-on-position.component.html',
    styleUrls: ['./person-on-position.component.scss']
})
export class PersonOnPositionComponent implements OnInit {

    @Input() id: number;
    @Input() personOnPosition: PersonOnPositionEntity;

    constructor() {
    }

    ngOnInit() {
    }

}
