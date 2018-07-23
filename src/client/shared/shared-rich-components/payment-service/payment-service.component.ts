import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {DataSourceRequestFilterTypeEnum} from '../../../../shared/data-source/models/data-source-request-filter-type.enum';
import {PaymentServiceEntity} from '../../../../dao/payment-service/payment-service.entity';
import {PaymentServiceRestService} from '../../shared-rest-services/payment-service-rest/payment-service-rest.service';

@Component({
    selector: 'app-payment-service',
    templateUrl: './payment-service.component.html',
    styleUrls: ['./payment-service.component.scss']
})
export class PaymentServiceComponent implements OnInit, OnChanges {

    @Input() id: number;
    @Input() item: PaymentServiceEntity;

    constructor(private paymentServiceRestService: PaymentServiceRestService) {
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

        this.paymentServiceRestService.getData({
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
