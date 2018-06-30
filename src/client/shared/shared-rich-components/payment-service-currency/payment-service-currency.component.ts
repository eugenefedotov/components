import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {PaymentServiceCurrencyEntity} from '../../../../dao/payment-service-currency/payment-service-currency.entity';
import {PaymentServiceCurrencyRestService} from '../../shared-rest-services/payment-service-currency-rest/payment-service-currency-rest.service';

@Component({
    selector: 'app-payment-service-currency',
    templateUrl: './payment-service-currency.component.html',
    styleUrls: ['./payment-service-currency.component.scss']
})
export class PaymentServiceCurrencyComponent implements OnInit, OnChanges {

    @Input() id: number;
    @Input() item: PaymentServiceCurrencyEntity;

    constructor(private paymentServiceCurrencyRestService: PaymentServiceCurrencyRestService) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.hasOwnProperty('id')) {
            this.updateItem();
        }
    }

    ngOnInit() {
    }

    async updateItem() {
        if (!this.id) {
            return;
        }

        if (this.item && this.item.id === this.id) {
            return;
        }

        this.item = await this.paymentServiceCurrencyRestService.getByKey(this.id);
    }
}
