import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PaymentServiceCurrencyRestService} from '../../shared-rest-services/payment-service-currency-rest/payment-service-currency-rest.service';
import {ListSource} from '../../../../shared/list-source/list-source';
import {PaymentServiceCurrencyEntity} from '../../../../dao/payment-service-currency/payment-service-currency.entity';
import {DataSourceListSource} from '../../../../shared/list-source/impl/data-source-list-source';

@Component({
    selector: 'app-payment-service-currency-list',
    templateUrl: './payment-service-currency-list.component.html',
    styleUrls: ['./payment-service-currency-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentServiceCurrencyListComponent implements OnInit {

    @Input() currencyId: number;
    @Output() currencyIdSource = new EventEmitter<number>();

    @Input() paymentServiceCurrencyId: number;
    @Output() paymentServiceCurrencyIdSource = new EventEmitter<number>();

    listSource: ListSource<PaymentServiceCurrencyEntity>;

    constructor(private paymentServiceCurrencyRestService: PaymentServiceCurrencyRestService) {
    }

    ngOnInit() {
        this.listSource = new DataSourceListSource(this.paymentServiceCurrencyRestService);
    }

}
