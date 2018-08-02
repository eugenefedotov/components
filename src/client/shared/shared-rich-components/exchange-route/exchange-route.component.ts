import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {PaymentServiceCurrencyEntity} from '../../../../dao/payment-service-currency/payment-service-currency.entity';
import {ExchangeRouteEntity} from '../../../../dao/exchange-route/exchange-route.entity';
import {ExchangeRouteRestService} from '../../shared-rest-services/exchange-route-rest/exchange-route-rest.service';
import {DataSourceRequestFilterTypeEnum} from '../../../../shared/classes/data-source/models/data-source-request-filter-type.enum';
import {hasAnyChanges} from '../../../../functions/has-any-changes';
import {FormControl, FormGroup} from '@angular/forms';
import {Subject} from 'rxjs';
import {distinctUntilChanged, map, takeUntil} from 'rxjs/operators';
import {BigNumber} from 'bignumber.js';

@Component({
    selector: 'app-exchange-route',
    templateUrl: './exchange-route.component.html',
    styleUrls: ['./exchange-route.component.scss']
})
export class ExchangeRouteComponent implements OnInit, OnChanges, OnDestroy {

    @Input()
    fromSum = 0;

    @Input()
    fromPaymentServiceCurrency: PaymentServiceCurrencyEntity;

    @Input()
    toPaymentServiceCurrency: PaymentServiceCurrencyEntity;

    @Output()
    validChange = new EventEmitter<boolean>();

    exchangeRoute: ExchangeRouteEntity;

    form = new FormGroup({
        fromClient: new FormControl(0),
        fromFee: new FormControl(0),
        from: new FormControl(0),
        to: new FormControl(0),
        toFee: new FormControl(0),
        toClient: new FormControl(0)
    });

    destroy$ = new Subject();

    constructor(private exchangeRouteRestService: ExchangeRouteRestService) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (hasAnyChanges(changes, ['fromPaymentServiceCurrency', 'toPaymentServiceCurrency'])) {
            this.updateRoute();
        }
        if (hasAnyChanges(changes, ['fromSum'])) {
            this.updateByFromClient(this.fromSum);
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

        this.form.statusChanges.pipe(
            takeUntil(this.destroy$),
            map(() => this.form.valid),
            distinctUntilChanged()
        )
            .subscribe((valid) => this.validChange.emit(valid));
    }

    updateByFromClient(val: number) {
        this.form.get('from').setValue(this.fromPaymentServiceCurrency.calculateTargetSum(val), {emitEvent: false});
        this.updateToByFrom();
        this.updateFee();
    }

    updateByFrom(val: number) {
        this.form.get('fromClient').setValue(this.fromPaymentServiceCurrency.calculateSourceSum(val), {emitEvent: false});
        this.updateToByFrom();
        this.updateFee();
    }

    updateByTo(val: number) {
        this.form.get('toClient').setValue(this.toPaymentServiceCurrency.calculateTargetSum(val), {emitEvent: false});
        this.updateFromByTo();
        this.updateFee();
    }

    updateByToClient(val: number) {
        this.form.get('to').setValue(this.toPaymentServiceCurrency.calculateSourceSum(val), {emitEvent: false});
        this.updateFromByTo();
        this.updateFee();
    }

    updateFromByTo() {
        const to = this.form.get('to').value;
        const from = new BigNumber(to).div(this.exchangeRoute.toAmount).times(this.exchangeRoute.fromAmount).toNumber();

        this.form.get('from').setValue(from, {emitEvent: false});
        this.form.get('fromClient').setValue(this.fromPaymentServiceCurrency.calculateSourceSum(from), {emitEvent: false});
    }

    updateToByFrom() {
        const from = this.form.get('from').value;
        const to = new BigNumber(from).div(this.exchangeRoute.fromAmount).times(this.exchangeRoute.toAmount).toNumber();

        this.form.get('to').setValue(to, {emitEvent: false});
        this.form.get('toClient').setValue(this.toPaymentServiceCurrency.calculateTargetSum(to), {emitEvent: false});
    }

    updateFee() {
        this.form.get('fromFee').setValue(this.fromPaymentServiceCurrency.calculateFee(this.form.get('from').value, false));
        this.form.get('toFee').setValue(this.toPaymentServiceCurrency.calculateFee(this.form.get('to').value, false));
    }

    updateRoute() {
        this.exchangeRoute = null;
        if (!this.fromPaymentServiceCurrency || !this.toPaymentServiceCurrency) {
            return;
        }

        this.exchangeRouteRestService.getData({
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
        })
            .subscribe(value => this.exchangeRoute = value.items[0]);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
