import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {ExchangeEntity} from '../../../../dao/exchange/exchange.entity';

@Component({
    selector: 'app-exchange-info',
    templateUrl: './exchange-info.component.html',
    styleUrls: ['./exchange-info.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExchangeInfoComponent implements OnInit {

    @Input() exchange: ExchangeEntity;

    constructor() {
    }

    ngOnInit() {
    }

}
