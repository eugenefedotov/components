import {Component, Input, OnInit} from '@angular/core';
import {PositionEntity} from '../../../../../../dao/content/position/position.entity';

@Component({
    selector: 'app-position',
    templateUrl: './position.component.html',
    styleUrls: ['./position.component.scss']
})
export class PositionComponent implements OnInit {

    @Input() id: number;
    @Input() position: PositionEntity;

    constructor() {
    }

    ngOnInit() {
    }

}
