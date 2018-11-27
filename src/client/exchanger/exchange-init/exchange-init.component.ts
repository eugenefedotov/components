import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {PaymentServiceCurrencyEntity} from '../../../dao/payment-service-currency/payment-service-currency.entity';
import {ActivatedRoute, Router} from '@angular/router';
import {ExchangeInitParamsModel} from './exchange-init-params.model';
import {ExchangeRestService} from '../../shared/shared-rest-services/exchange-rest/exchange-rest.service';
import {ExchangeRouteEntity} from '../../../dao/exchange-route/exchange-route.entity';
import {ExchangeEntity} from '../../../dao/exchange/exchange.entity';
import {SelectSource} from '../../../shared/classes/select-source/select-source';
import {LocalSelectSource} from '../../../shared/classes/select-source/impl/local-select-source';
import {PaymentServiceRequisiteTypeEntity} from '../../../dao/payment-service-requisite-type/payment-service-requisite-type.entity';
import {SelectItemModel} from '../../../shared/classes/select-source/models/select-item.model';
import {FormBuilder, FormControl, ValidationErrors, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
    selector: 'app-exchange-init',
    templateUrl: './exchange-init.component.html',
    styleUrls: ['./exchange-init.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExchangeInitComponent implements OnInit, OnDestroy {

    form = this.fb.group({
        fromSum: [null, [Validators.required]],
        requisiteType: [null, [Validators.required]],
        requisiteValue: [null, [Validators.required, control => this.requisiteValueValidator(control)]]
    });

    fromPaymentServiceCurrency: PaymentServiceCurrencyEntity;
    toPaymentServiceCurrency: PaymentServiceCurrencyEntity;
    exchangeRoute: ExchangeRouteEntity;
    requisiteTypeSource: SelectSource<PaymentServiceRequisiteTypeEntity>;
    selectedRequisiteTypeItem: SelectItemModel<PaymentServiceRequisiteTypeEntity>;

    destroy$ = new Subject();

    constructor(private route: ActivatedRoute,
                private router: Router,
                private cdr: ChangeDetectorRef,
                private exchangeRestService: ExchangeRestService,
                private fb: FormBuilder) {
    }

    ngOnInit() {
        this.route.data.subscribe((data: { params: ExchangeInitParamsModel }) => {
            this.fromPaymentServiceCurrency = data.params.from;
            this.toPaymentServiceCurrency = data.params.to;

            this.updateRequisiteTypeSource();
            this.cdr.markForCheck();
        });

        this.route.queryParamMap.subscribe(pm => {
            this.form.patchValue({
                fromSum: Number(pm.get('fromSum'))
            });
            this.cdr.markForCheck();
        });

        this.form.get('requisiteType').valueChanges
            .pipe(
                takeUntil(this.destroy$)
            )
            .subscribe(() => {
                this.form.get('requisiteValue').setValue('');
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    onExchangeRouteChange($event: ExchangeRouteEntity) {
        this.exchangeRoute = $event;
    }

    async onExchangeClick() {
        let exchange = new ExchangeEntity();
        exchange.exchangeRoute = this.exchangeRoute;
        exchange.fromSum = this.form.get('fromSum').value;
        exchange.toRequisiteType = this.selectedRequisiteTypeItem && this.selectedRequisiteTypeItem.attributes;
        exchange.toRequisiteValue = this.form.get('requisiteValue').value;

        exchange = await this.exchangeRestService.initExchange(exchange).toPromise();

        await this.router.navigate(['exchanger', 'exchange-status', exchange.uuid]);
    }

    private updateRequisiteTypeSource() {
        const requisiteTypes = this.toPaymentServiceCurrency ? this.toPaymentServiceCurrency.requisiteTypes : [];

        this.requisiteTypeSource = new LocalSelectSource(
            requisiteTypes
                .map(type => ({
                    value: type.id,
                    name: type.name,
                    attributes: type
                }))
        );
    }

    private requisiteValueValidator(control: FormControl): ValidationErrors | null {
        if (!this.selectedRequisiteTypeItem) {
            return null;
        }

        const mask = this.selectedRequisiteTypeItem.attributes.mask;

        if (!mask.isValidAndComplete(control.value)) {
            return {
                mask: mask.try('').formatted
            };
        }

        return null;
    }
}
