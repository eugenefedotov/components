import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {PaymentServiceCurrencyEntity} from '../../../../dao/payment-service-currency/payment-service-currency.entity';
import {PaymentServiceCurrencyRestService} from '../../shared-rest-services/payment-service-currency-rest/payment-service-currency-rest.service';
import {DataSourceRequestFilterTypeEnum} from '../../../../shared/data-source/models/data-source-request-filter-type.enum';

@Component({
    selector: 'app-payment-service-currency',
    templateUrl: './payment-service-currency.component.html',
    styleUrls: ['./payment-service-currency.component.scss']
})
export class PaymentServiceCurrencyComponent implements OnInit, OnChanges {

    @Input() id: number;
    @Input() item: PaymentServiceCurrencyEntity;
    @Input() selected = false;

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

       this.paymentServiceCurrencyRestService.getData({
            filter: [
                {
                    field: 'id',
                    type: DataSourceRequestFilterTypeEnum.Equal,
                    values: [this.id]
                }
            ],
            offset: 0,
            limit: 1
        }).subscribe(value => this.item = value.items[0]);
    }
}
