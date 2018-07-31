import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {PaymentServiceCurrencyEntity} from '../../../../dao/payment-service-currency/payment-service-currency.entity';
import {PaymentServiceCurrencyRestService} from '../../shared-rest-services/payment-service-currency-rest/payment-service-currency-rest.service';
import {DataSourceRequestFilterTypeEnum} from '../../../../shared/classes/data-source/models/data-source-request-filter-type.enum';
import {CurrencyEntity} from '../../../../dao/currency/currency.entity';
import {CurrencyRestService} from '../../shared-rest-services/currency-rest/currency-rest.service';

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.scss']
})
export class CurrencyComponent implements OnInit, OnChanges {

    @Input() id: number;
    @Input() item: CurrencyEntity;

    constructor(private currencyRestService: CurrencyRestService) {
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

        this.currencyRestService.getData({
            filter: [
                {
                    field: 'id',
                    type: DataSourceRequestFilterTypeEnum.Equal,
                    values: [this.id]
                }
            ],
            offset: 0,
            limit: 1
        })
            .subscribe(value => this.item = value.items[0]);
    }
}
