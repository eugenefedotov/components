import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {PaymentServiceCurrencyEntity} from '../../../../dao/payment-service-currency/payment-service-currency.entity';
import {ExchangeRouteEntity} from '../../../../dao/exchange-route/exchange-route.entity';
import {ExchangeRouteRestService} from '../../shared-rest-services/exchange-route-rest/exchange-route-rest.service';
import {DataSourceRequestFilterTypeEnum} from '../../../../shared/data-source/models/data-source-request-filter-type.enum';
import {hasAnyChangesFunction} from '../../../../functions/has-any-changes.function';
import {FormControl, FormGroup} from '@angular/forms';
import {Subject} from 'rxjs';
import {distinctUntilChanged, takeUntil} from 'rxjs/operators';
import {BigNumber} from 'bignumber.js';

@Component({
    selector: 'app-exchange-route',
    templateUrl: './exchange-route.component.html',
    styleUrls: ['./exchange-route.component.scss']
})
export class ExchangeRouteComponent implements OnInit, OnChanges, OnDestroy {

    @Input()
    fromPaymentServiceCurrency: PaymentServiceCurrencyEntity;

    @Input()
    toPaymentServiceCurrency: PaymentServiceCurrencyEntity;

    exchangeRoute: ExchangeRouteEntity;

    form = new FormGroup({
        fromClient: new FormControl(),
        from: new FormControl(),
        to: new FormControl(),
        toClient: new FormControl()
    });

    destroy$ = new Subject();

    constructor(private exchangeRouteRestService: ExchangeRouteRestService) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (hasAnyChangesFunction(changes, ['fromPaymentServiceCurrency', 'toPaymentServiceCurrency'])) {
            this.updateRoute();
        }
    }

    ngOnInit() {
        this.form.get('fromClient').valueChanges
            .pipe(
                takeUntil(this.destroy$),
                distinctUntilChanged()
            )
            .subscribe((val) => this.updateByFromClient(val));
        this.form.get('from').valueChanges
            .pipe(
                takeUntil(this.destroy$),
                distinctUntilChanged()
            )
            .subscribe((val) => this.updateByFrom(val));
        this.form.get('to').valueChanges
            .pipe(
                takeUntil(this.destroy$),
                distinctUntilChanged()
            )
            .subscribe((val) => this.updateByTo(val));
        this.form.get('toClient').valueChanges
            .pipe(
                takeUntil(this.destroy$),
                distinctUntilChanged()
            )
            .subscribe((val) => this.updateByToClient(val));
    }

    updateByFromClient(val: number) {
        this.form.get('from').setValue(val, {emitEvent: false});
        this.updateTo();
    }

    updateByFrom(val: number) {
        this.form.get('fromClient').setValue(val, {emitEvent: false});
        this.updateTo();
    }

    updateByTo(val: number) {
        this.form.get('toClient').setValue(val, {emitEvent: false});
        this.updateFrom();
    }

    updateByToClient(val: number) {
        this.form.get('to').setValue(val, {emitEvent: false});
        this.updateFrom();
    }

    updateFrom() {
        const to = this.form.get('to').value;
        const from = new BigNumber(to).div(this.exchangeRoute.toAmount).times(this.exchangeRoute.fromAmount).toNumber();

        this.form.get('from').setValue(from, {emitEvent: false});
        this.form.get('fromClient').setValue(from, {emitEvent: false});
    }

    updateTo() {
        const from = this.form.get('from').value;
        const to = new BigNumber(from).div(this.exchangeRoute.fromAmount).times(this.exchangeRoute.toAmount).toNumber();

        this.form.get('to').setValue(to, {emitEvent: false});
        this.form.get('toClient').setValue(to, {emitEvent: false});
    }

    async updateRoute() {
        this.exchangeRoute = null;
        if (!this.fromPaymentServiceCurrency || !this.toPaymentServiceCurrency) {
            return;
        }

        this.exchangeRoute = (await this.exchangeRouteRestService.getData({
            filter: [
                {
                    field: 'fromPaymentServiceCurrency',
                    type: DataSourceRequestFilterTypeEnum.Equal,
                    values: [this.fromPaymentServiceCurrency.id]
                },
                {
                    field: 'toPaymentServiceCurrency',
                    type: DataSourceRequestFilterTypeEnum.Equal,
                    values: [this.toPaymentServiceCurrency.id]
                }
            ],
            offset: 0,
            limit: 1
        })).items[0];
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

}
