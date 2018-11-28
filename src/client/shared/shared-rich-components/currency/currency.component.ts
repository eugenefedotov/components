import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges
} from '@angular/core';
import {DataSourceRequestFilterTypeEnum} from '../../../../shared/classes/data-source/models/data-source-request-filter-type.enum';
import {CurrencyEntity} from '../../../../dao/currency/currency.entity';
import {CurrencyRestService} from '../../shared-rest-services/currency-rest/currency-rest.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
    selector: 'app-currency',
    templateUrl: './currency.component.html',
    styleUrls: ['./currency.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurrencyComponent implements OnInit, OnChanges, OnDestroy {

    @Input() id: number;
    @Input() item: CurrencyEntity;

    private destroy$ = new Subject();

    constructor(private currencyRestService: CurrencyRestService, private cdr: ChangeDetectorRef) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.hasOwnProperty('id')) {
            this.updateItem();
        }
    }

    ngOnInit() {
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
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
            .pipe(
                takeUntil(this.destroy$)
            )
            .subscribe(value => {
                this.item = value.items[0];
                this.cdr.markForCheck();
            });
    }
}
