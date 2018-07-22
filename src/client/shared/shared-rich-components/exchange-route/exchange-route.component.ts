import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {PaymentServiceCurrencyEntity} from '../../../../dao/payment-service-currency/payment-service-currency.entity';
import {ExchangeRouteEntity} from '../../../../dao/exchange-route/exchange-route.entity';
import {ExchangeRouteRestService} from '../../shared-rest-services/exchange-route-rest/exchange-route-rest.service';
import {DataSourceRequestFilterTypeEnum} from '../../../../shared/data-source/models/data-source-request-filter-type.enum';
import {hasAnyChanges} from '../../../../functions/has-any-changes';
import {FormControl, FormGroup} from '@angular/forms';
import {Subject} from 'rxjs';
import {distinctUntilChanged, takeUntil} from 'rxjs/operators';
import {BigNumber} from 'bignumber.js';
import {calculateSourceSum} from '../../../../functions/calculate-source-sum';
import {calculateTargetSum} from '../../../../functions/calculate-target-sum';

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
        fromFee: new FormControl(),
        from: new FormControl(),
        to: new FormControl(),
        toFee: new FormControl(),
        toClient: new FormControl()
    });

    destroy$ = new Subject();

    constructor(private exchangeRouteRestService: ExchangeRouteRestService) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (hasAnyChanges(changes, ['fromPaymentServiceCurrency', 'toPaymentServiceCurrency'])) {
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
        val = this.calculateFeeByPaymentServiceCurrency(val, this.fromPaymentServiceCurrency, false);
        this.form.get('from').setValue(val, {emitEvent: false});
        this.updateToByFrom();
        this.updateFee();
    }

    updateByFrom(val: number) {
        val = this.calculateFeeByPaymentServiceCurrency(val, this.fromPaymentServiceCurrency, true);
        this.form.get('fromClient').setValue(val, {emitEvent: false});
        this.updateToByFrom();
        this.updateFee();
    }

    updateByTo(val: number) {
        val = this.calculateFeeByPaymentServiceCurrency(val, this.toPaymentServiceCurrency, false);
        this.form.get('toClient').setValue(val, {emitEvent: false});
        this.updateFromByTo();
        this.updateFee();
    }

    updateByToClient(val: number) {
        val = this.calculateFeeByPaymentServiceCurrency(val, this.toPaymentServiceCurrency, true);
        this.form.get('to').setValue(val, {emitEvent: false});
        this.updateFromByTo();
        this.updateFee();
    }

    updateFromByTo() {
        const to = this.form.get('to').value;
        const from = new BigNumber(to).div(this.exchangeRoute.toAmount).times(this.exchangeRoute.fromAmount).toNumber();

        this.form.get('from').setValue(from, {emitEvent: false});

        const fromClient = this.calculateFeeByPaymentServiceCurrency(from, this.fromPaymentServiceCurrency, true);

        this.form.get('fromClient').setValue(fromClient, {emitEvent: false});
    }

    updateToByFrom() {
        const from = this.form.get('from').value;
        const to = new BigNumber(from).div(this.exchangeRoute.fromAmount).times(this.exchangeRoute.toAmount).toNumber();

        this.form.get('to').setValue(to, {emitEvent: false});

        const toClient = this.calculateFeeByPaymentServiceCurrency(to, this.toPaymentServiceCurrency, false);

        this.form.get('toClient').setValue(toClient, {emitEvent: false});
    }

    updateFee() {
        const from = this.form.get('from').value;
        const fromClient = this.form.get('fromClient').value;
        this.form.get('fromFee').setValue(new BigNumber(fromClient).minus(from).toNumber());

        const to = this.form.get('to').value;
        const toClient = this.form.get('toClient').value;
        this.form.get('toFee').setValue(new BigNumber(to).minus(toClient).toNumber());
    }

    calculateFeeByPaymentServiceCurrency(sum: number, paymentServiceCurrencyEntity: PaymentServiceCurrencyEntity, byTargetSum: boolean): number {
        const func = byTargetSum ? calculateSourceSum : calculateTargetSum;
        return func(sum, {
            percent: paymentServiceCurrencyEntity.feePercent,
            fixed: paymentServiceCurrencyEntity.feeFixed
        });
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
