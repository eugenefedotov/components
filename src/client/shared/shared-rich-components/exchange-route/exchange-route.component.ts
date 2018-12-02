import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges
} from '@angular/core';
import {PaymentServiceCurrencyEntity} from '../../../../dao/payment-service-currency/payment-service-currency.entity';
import {ExchangeRouteEntity} from '../../../../dao/exchange-route/exchange-route.entity';
import {ExchangeRouteRestService} from '../../shared-rest-services/exchange-route-rest/exchange-route-rest.service';
import {DataSourceRequestFilterTypeEnum} from '../../../../shared/classes/data-source/models/data-source-request-filter-type.enum';
import {hasAnyChanges} from '../../../../functions/has-any-changes';
import {FormBuilder, FormControl, ValidatorFn, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import {distinctUntilChanged, map, takeUntil} from 'rxjs/operators';
import {BigNumber} from 'bignumber.js';

@Component({
    selector: 'app-exchange-route',
    templateUrl: './exchange-route.component.html',
    styleUrls: ['./exchange-route.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExchangeRouteComponent implements OnInit, OnChanges, OnDestroy {

    @Input()
    disabled = false;

    @Input()
    fromSum = 0;

    @Input()
    fromPaymentServiceCurrency: PaymentServiceCurrencyEntity;

    @Input()
    toPaymentServiceCurrency: PaymentServiceCurrencyEntity;

    @Output()
    validChange = new EventEmitter<boolean>();

    @Output()
    fromSumChange = new EventEmitter<number>();

    @Input()
    exchangeRoute: ExchangeRouteEntity;

    @Output()
    exchangeRouteChange = new EventEmitter<ExchangeRouteEntity>();

    form = this.fb.group({
        fromClient: [0],
        fromFee: [0],
        from: [0],
        to: [0],
        toFee: [0],
        toClient: [0]
    });

    destroy$ = new Subject();

    constructor(private exchangeRouteRestService: ExchangeRouteRestService,
                private fb: FormBuilder,
                private cdr: ChangeDetectorRef
    ) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (hasAnyChanges(changes, ['fromPaymentServiceCurrency', 'toPaymentServiceCurrency'])) {
            this.updateRouteByPSC();
            this.updateValidators();
        }
        if (hasAnyChanges(changes, ['fromSum'])) {
            this.form.get('fromClient').setValue(this.fromSum);
        }
        if (hasAnyChanges(changes, ['exchangeRoute'])) {
            this.setExchangeRoute(this.exchangeRoute);
        }
    }

    ngOnInit() {
        this.form.get('fromClient').valueChanges
            .pipe(
                takeUntil(this.destroy$),
                distinctUntilChanged()
            )
            .subscribe((val) => {
                this.fromSum = val;
                this.fromSumChange.emit(val);
                this.updateByFromClient(val);
            });
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
        if (!this.exchangeRoute || !this.exchangeRoute.fromPaymentServiceCurrency) {
            return;
        }

        this.form.get('from').setValue(this.exchangeRoute.fromPaymentServiceCurrency.calculateTargetSum(val), {emitEvent: false});
        this.updateToByFrom();
        this.updateFee();
    }

    updateByFrom(val: number) {
        if (!this.exchangeRoute || !this.fromPaymentServiceCurrency) {
            return;
        }

        this.form.get('fromClient').setValue(this.exchangeRoute.fromPaymentServiceCurrency.calculateSourceSum(val), {emitEvent: false});
        this.updateToByFrom();
        this.updateFee();
    }

    updateByTo(val: number) {
        if (!this.exchangeRoute || !this.toPaymentServiceCurrency) {
            return;
        }
        this.form.get('toClient').setValue(this.exchangeRoute.toPaymentServiceCurrency.calculateTargetSum(val), {emitEvent: false});
        this.updateFromByTo();
        this.updateFee();
    }

    updateByToClient(val: number) {
        if (!this.exchangeRoute || !this.toPaymentServiceCurrency) {
            return;
        }

        this.form.get('to').setValue(this.exchangeRoute.toPaymentServiceCurrency.calculateSourceSum(val), {emitEvent: false});
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
        this.form.get('toClient').setValue(this.exchangeRoute.toPaymentServiceCurrency.calculateTargetSum(to), {emitEvent: false});
    }

    updateFee() {
        this.form.get('fromFee').setValue(this.exchangeRoute.fromPaymentServiceCurrency.calculateFee(this.form.get('from').value, false));
        this.form.get('toFee').setValue(this.exchangeRoute.toPaymentServiceCurrency.calculateFee(this.form.get('to').value, false));
    }

    updateRouteByPSC() {
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
            .pipe(
                takeUntil(this.destroy$)
            )
            .subscribe(value => {
                this.setExchangeRoute(value.items[0]);
                this.cdr.markForCheck();
            });
    }

    setExchangeRoute(exchangeRoute: ExchangeRouteEntity) {
        this.exchangeRoute = exchangeRoute;
        this.exchangeRouteChange.emit(this.exchangeRoute);

        this.updateValidators();

        if (this.fromSum) {
            this.updateByFromClient(this.fromSum);
        }
    }

    updateValidators() {
        const fromClientControl = this.form.get('fromClient') as FormControl;
        const fromControl = this.form.get('from') as FormControl;
        const toControl = this.form.get('to') as FormControl;
        const toClientControl = this.form.get('toClient') as FormControl;

        [fromClientControl, fromControl, toControl, toClientControl].forEach(cnt => cnt.clearValidators());

        if (!this.exchangeRoute) {
            return;
        }

        const fromControlWithValidation = this.exchangeRoute.fromPaymentServiceCurrency.hasFee() ? fromControl : fromClientControl;
        const toControlWithValidation = this.exchangeRoute.toPaymentServiceCurrency.hasFee() ? toControl : toClientControl;

        const nonZero: ValidatorFn = c => c.value === 0 ? {nonZero: true} : null;

        const fromValidators: ValidatorFn[] = [Validators.required, nonZero];
        const toValidators: ValidatorFn[] = [Validators.required, nonZero];

        const minFrom = Math.max(0, this.exchangeRoute.fromMinAmount, this.exchangeRoute.fromPaymentServiceCurrency.minAmount);
        fromValidators.push(Validators.min(minFrom));

        const minTo = Math.max(0, this.exchangeRoute.toMinAmount, this.exchangeRoute.toPaymentServiceCurrency.minAmount);
        toValidators.push(Validators.min(minTo));

        if (this.exchangeRoute.fromMaxAmount || this.exchangeRoute.fromPaymentServiceCurrency.maxAmount) {
            const maxFrom = Math.min(this.exchangeRoute.fromMaxAmount, this.exchangeRoute.fromPaymentServiceCurrency.maxAmount);
            fromValidators.push(Validators.max(maxFrom));
        }

        if (this.exchangeRoute.toMaxAmount || this.exchangeRoute.toPaymentServiceCurrency.maxAmount) {
            const maxTo = Math.min(this.exchangeRoute.toMaxAmount, this.exchangeRoute.toPaymentServiceCurrency.maxAmount);
            toValidators.push(Validators.max(maxTo));
        }

        fromControlWithValidation.setValidators(fromValidators);
        toControlWithValidation.setValidators(toValidators);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
