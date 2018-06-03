import {Component, Input, OnInit} from '@angular/core';
import {PersonEntity} from '../../../../../../dao/content/person/person.entity';

@Component({
    selector: 'app-person',
    templateUrl: './person.component.html',
    styleUrls: ['./person.component.scss']
})
export class PersonComponent implements OnInit {

    @Input() id: number;
    @Input() person: PersonEntity;

    constructor() {
    }

    ngOnInit() {
    }

}
