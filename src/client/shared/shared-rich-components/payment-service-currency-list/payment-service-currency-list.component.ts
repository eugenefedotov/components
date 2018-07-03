import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {PaymentServiceCurrencyRestService} from '../../shared-rest-services/payment-service-currency-rest/payment-service-currency-rest.service';
import {ListSource} from '../../../../shared/list-source/list-source';
import {PaymentServiceCurrencyEntity} from '../../../../dao/payment-service-currency/payment-service-currency.entity';
import {DataSourceListSource} from '../../../../shared/list-source/impl/data-source-list-source';
import {CurrencyEntity} from '../../../../dao/currency/currency.entity';
import {PaymentServiceEntity} from '../../../../dao/payment-service/payment-service.entity';
import {KeyComparator} from '../../../../shared/comparator/key-comparator';
import {DataSourceRequestFilterTypeEnum} from '../../../../shared/data-source/models/data-source-request-filter-type.enum';
import {DataSourceRequestFilterItemModel} from '../../../../shared/data-source/models/data-source-request-filter-item.model';
import {hasAnyChanges} from '../../../../functions/has-any-changes';

@Component({
    selector: 'app-payment-service-currency-list',
    templateUrl: './payment-service-currency-list.component.html',
    styleUrls: ['./payment-service-currency-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentServiceCurrencyListComponent implements OnChanges, OnInit {

    @Input() currency: CurrencyEntity;
    @Output() currencyChange = new EventEmitter<CurrencyEntity>();

    @Input() paymentService: PaymentServiceEntity;
    @Output() paymentServiceChange = new EventEmitter<PaymentServiceEntity>();

    @Input() paymentServiceCurrency: PaymentServiceCurrencyEntity;
    @Output() paymentServiceCurrencyChange = new EventEmitter<PaymentServiceCurrencyEntity>();

    @Input() listSource: ListSource<PaymentServiceCurrencyEntity>;

    comparator = new KeyComparator<PaymentServiceCurrencyEntity>('id');

    constructor(private paymentServiceCurrencyRestService: PaymentServiceCurrencyRestService) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (hasAnyChanges(changes, ['currency', 'paymentService'])) {
            this.updateListSource();
        }
    }

    ngOnInit(): void {
        if (!this.listSource) {
            this.updateListSource();
        }
    }

    updateListSource() {
        const filter: DataSourceRequestFilterItemModel<PaymentServiceCurrencyEntity>[] = [];

        if (this.currency) {
            filter.push({
                field: 'currency',
                type: DataSourceRequestFilterTypeEnum.Equal,
                values: [this.currency.id]
            });
        }

        if (this.paymentService) {
            filter.push({
                field: 'paymentService',
                type: DataSourceRequestFilterTypeEnum.Equal,
                values: [this.paymentService.id]
            });
        }

        this.listSource = new DataSourceListSource(this.paymentServiceCurrencyRestService, filter);
    }
}
