import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {PaymentServiceCurrencyRestService} from '../../shared-rest-services/payment-service-currency-rest/payment-service-currency-rest.service';
import {ListSource} from '../../../../shared/classes/list-source/list-source';
import {PaymentServiceCurrencyEntity} from '../../../../dao/payment-service-currency/payment-service-currency.entity';
import {DataSourceListSource} from '../../../../shared/classes/list-source/impl/data-source-list-source';
import {CurrencyEntity} from '../../../../dao/currency/currency.entity';
import {PaymentServiceEntity} from '../../../../dao/payment-service/payment-service.entity';
import {KeyComparator} from '../../../../shared/classes/comparator/impl/key-comparator';
import {DataSourceRequestFilterTypeEnum} from '../../../../shared/classes/data-source/models/data-source-request-filter-type.enum';
import {DataSourceRequestFilterItemModel} from '../../../../shared/classes/data-source/models/data-source-request-filter-item.model';
import {hasAnyChanges} from '../../../../functions/has-any-changes';
import {CurrencyRestService} from '../../shared-rest-services/currency-rest/currency-rest.service';
import {SelectSource} from '../../../../shared/classes/select-source/select-source';
import {DataSourceSelectSource} from '../../../../shared/classes/select-source/impl/data-source-select-source';
import {SelectItemModel} from '../../../../shared/classes/select-source/models/select-item.model';
import {PaymentServiceRestService} from '../../shared-rest-services/payment-service-rest/payment-service-rest.service';
import {PersistentFilterDataSource} from '../../../../shared/classes/data-source/impl/persistent-filter-data-source';

@Component({
    selector: 'app-payment-service-currency-list',
    templateUrl: './payment-service-currency-list.component.html',
    styleUrls: ['./payment-service-currency-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentServiceCurrencyListComponent implements OnChanges, OnInit {

    @Input() currency: SelectItemModel<CurrencyEntity>;
    @Output() currencyChange = new EventEmitter<SelectItemModel<CurrencyEntity>>();

    @Input() paymentService: SelectItemModel<PaymentServiceEntity>;
    @Output() paymentServiceChange = new EventEmitter<SelectItemModel<PaymentServiceEntity>>();

    @Input() paymentServiceCurrency: PaymentServiceCurrencyEntity;
    @Output() paymentServiceCurrencyChange = new EventEmitter<PaymentServiceCurrencyEntity>();

    listSource: ListSource<PaymentServiceCurrencyEntity>;

    currencySelectSource: SelectSource<CurrencyEntity>;
    paymentServiceSelectSource: SelectSource<PaymentServiceEntity>;

    paymentServiceCurrencyComparator = new KeyComparator<PaymentServiceCurrencyEntity>('id');

    constructor(private paymentServiceCurrencyRestService: PaymentServiceCurrencyRestService,
                private paymentServiceRestService: PaymentServiceRestService,
                private currencyRestService: CurrencyRestService
    ) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (hasAnyChanges<PaymentServiceCurrencyListComponent>(changes, ['currency', 'paymentService'])) {
            this.updateListSource();
        }
    }

    ngOnInit(): void {
        if (!this.listSource) {
            this.updateListSource();
        }

        this.currencySelectSource = new DataSourceSelectSource(this.currencyRestService);
        this.paymentServiceSelectSource = new DataSourceSelectSource(this.paymentServiceRestService);
    }

    updateListSource() {
        const filter: DataSourceRequestFilterItemModel<PaymentServiceCurrencyEntity>[] = [];
        if (this.currency) {
            filter.push({
                field: 'currency',
                type: DataSourceRequestFilterTypeEnum.Equal,
                values: [this.currency.value]
            });
        }

        if (this.paymentService) {
            filter.push({
                field: 'paymentService',
                type: DataSourceRequestFilterTypeEnum.Equal,
                values: [this.paymentService.value]
            });
        }

        this.listSource = new DataSourceListSource(this.paymentServiceCurrencyRestService, filter);
    }

    onCurrencyChange($event: SelectItemModel) {
        this.currencyChange.emit($event);
        this.updateListSource();
    }

    onPaymentServiceChange($event: SelectItemModel) {
        this.paymentServiceChange.emit($event);
        this.updateListSource();
    }

    onPaymentServiceCurrencyClick(item: PaymentServiceCurrencyEntity) {
        this.paymentServiceCurrency = item;
        this.paymentServiceCurrencyChange.emit(this.paymentServiceCurrency);
    }
}
