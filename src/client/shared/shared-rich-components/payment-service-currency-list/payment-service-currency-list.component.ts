import {Component, OnInit} from '@angular/core';
import {PaymentServiceCurrencyRestService} from '../../shared-rest-services/payment-service-currency-rest/payment-service-currency-rest.service';
import {ListSource} from '../../../../shared/list-source/list-source';
import {PaymentServiceCurrencyEntity} from '../../../../dao/payment-service-currency/payment-service-currency.entity';
import {RestDataListSource} from '../../../../shared/list-source/impl/rest-data-list-source';

@Component({
    selector: 'app-payment-service-currency-list',
    templateUrl: './payment-service-currency-list.component.html',
    styleUrls: ['./payment-service-currency-list.component.scss']
})
export class PaymentServiceCurrencyListComponent implements OnInit {

    listSource: ListSource<PaymentServiceCurrencyEntity>;

    constructor(private paymentServiceCurrencyRestService: PaymentServiceCurrencyRestService) {
    }

    ngOnInit() {
        this.listSource = new RestDataListSource(this.paymentServiceCurrencyRestService);
    }

}
