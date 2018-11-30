import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ExchangeEntity} from '../../../dao/exchange/exchange.entity';
import {ExchangeRestService} from '../../shared/shared-rest-services/exchange-rest/exchange-rest.service';
import {Subject} from 'rxjs';
import {finalize, takeUntil} from 'rxjs/operators';

@Component({
    selector: 'app-exchange-status',
    templateUrl: './exchange-status.component.html',
    styleUrls: ['./exchange-status.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExchangeStatusComponent implements OnInit, OnDestroy {

    updating = false;
    exchange: ExchangeEntity;

    private destroy$ = new Subject();

    constructor(private route: ActivatedRoute,
                private exchangeRestService: ExchangeRestService,
                private cdr: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.route.data.subscribe((data: { exchange: ExchangeEntity }) => {
            this.exchange = data.exchange;
            this.cdr.markForCheck();
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    onUpdate() {
        this.update();
    }

    update() {
        this.updating = true;
        this.exchangeRestService
            .getByUuid(this.exchange.uuid)
            .pipe(
                takeUntil(this.destroy$),
                finalize(() => this.updating = false)
            )
            .subscribe((exchange) => {
                this.exchange = exchange;
                this.cdr.markForCheck();
            });
    }
}
