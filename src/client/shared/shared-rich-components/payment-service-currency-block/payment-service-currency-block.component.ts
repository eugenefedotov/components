import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {PaymentServiceCurrencyEntity} from '../../../../dao/payment-service-currency/payment-service-currency.entity';
import {PaymentServiceCurrencyRestService} from '../../shared-rest-services/payment-service-currency-rest/payment-service-currency-rest.service';
import {DataSourceRequestFilterTypeEnum} from '../../../../shared/data-source/models/data-source-request-filter-type.enum';

@Component({
    selector: 'app-payment-service-currency-block',
    templateUrl: './payment-service-currency-block.component.html',
    styleUrls: ['./payment-service-currency-block.component.scss']
})
export class PaymentServiceCurrencyBlockComponent implements OnInit, OnChanges {

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
