import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {PaymentServiceCurrencyEntity} from '../../../../dao/payment-service-currency/payment-service-currency.entity';
import {PaymentServiceCurrencyRestService} from '../../shared-rest-services/payment-service-currency-rest/payment-service-currency-rest.service';
import {RestDataRequestFilterTypeEnum} from '../../../../shared/rest-data/models/rest-data-request-filter-type.enum';

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

    updateItem() {
        if (!this.id) {
            return;
        }

        if (this.item && this.item.id === this.id) {
            return;
        }

        this.fetchItem();
    }

    async fetchItem() {
        const result = await this.paymentServiceCurrencyRestService.getResult({
            filter: [
                {
                    field: 'id',
                    type: RestDataRequestFilterTypeEnum.Equal,
                    values: [this.id]
                }
            ]
        });

        this.item = result.items[0];
    }
}
