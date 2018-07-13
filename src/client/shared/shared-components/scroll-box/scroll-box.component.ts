import {
    AfterContentChecked,
    AfterViewChecked,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    DoCheck,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewChild
} from '@angular/core';
import {BigNumber} from 'bignumber.js';
import {Subject} from 'rxjs';
import {debounceTime, takeUntil} from 'rxjs/operators';
import {animate, style, transition, trigger} from '@angular/animations';

@Component({
    selector: 'app-scroll-box',
    templateUrl: './scroll-box.component.html',
    styleUrls: ['./scroll-box.component.scss'],
    animations: [
        trigger(
            'enterAnimation', [
                transition(':enter', [
                    style({opacity: 0}),
                    animate('.2s', style({opacity: 1}))
                ]),
                transition(':leave', [
                    style({opacity: 1}),
                    animate('.2s', style({opacity: 0}))
                ])
            ]
        )
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScrollBoxComponent implements OnInit, OnInit, DoCheck, AfterViewChecked, AfterContentChecked, OnDestroy {
    @Input() wheelSize = 50;

    @Input() horizontal = false;

    @Input() vertical = true;

    @Output() horizontalRelativeScrollPositionChange = new EventEmitter<number>();
    @Output() horizontalAbsoluteScrollPositionChange = new EventEmitter<number>();

    @Output() verticalRelativeScrollPositionChange = new EventEmitter<number>();
    @Output() verticalAbsoluteScrollPositionChange = new EventEmitter<number>();

    @Output() horizontalAbsoluteScrollSizeChange = new EventEmitter<number>();
    @Output() verticalAbsoluteScrollSizeChange = new EventEmitter<number>();

    @ViewChild('scrollContainer') scrollContainerRef: ElementRef<HTMLElement>;
    needUpdate$ = new Subject();
    destroy$ = new Subject();

    constructor(private cdr: ChangeDetectorRef) {
    }

    _horizontalRelativeScrollPositionBig = new BigNumber(0);

    set horizontalRelativeScrollPositionBig(value: BigNumber) {
        if (value.isNaN()) {
            console.error('isNaN');
        }

        value = BigNumber.min(BigNumber.max(value, 0), 1);

        if (this._horizontalRelativeScrollPositionBig.eq(value)) {
            return;
        }

        this._horizontalRelativeScrollPositionBig = value;
        this.needUpdate$.next();
        this.emitValues(true);
    }

    _verticalRelativeScrollPositionBig = new BigNumber(0);

    set verticalRelativeScrollPositionBig(value: BigNumber) {
        if (value.isNaN()) {
            console.error('isNaN');
        }

        value = BigNumber.min(BigNumber.max(value, 0), 1);

        if (this._verticalRelativeScrollPositionBig.eq(value)) {
            return;
        }

        this._verticalRelativeScrollPositionBig = value;
        this.needUpdate$.next();
        this.emitValues(false);
    }

    get _horizontalRelativeScrollSizeBig(): BigNumber {
        return new BigNumber(this.el.offsetWidth).div(this.el.scrollWidth);
    }

    get horizontalRelativeScrollSize(): number {
        return this._horizontalRelativeScrollSizeBig.toNumber();
    }

    get _verticalRelativeScrollSizeBig(): BigNumber {
        return new BigNumber(this.el.offsetHeight).div(this.el.scrollHeight);
    }

    get verticalRelativeScrollSize(): number {
        return this._verticalRelativeScrollSizeBig.toNumber();
    }

    get el(): HTMLElement {
        return this.scrollContainerRef.nativeElement;
    }

    get verticalScrollSize(): number {
        return this.el.scrollHeight - this.el.offsetHeight;
    }

    get horizontalScrollSize(): number {
        return this.el.scrollWidth - this.el.offsetWidth;
    }

    get horizontalRelativeScrollPosition(): number {
        return this._horizontalRelativeScrollPositionBig.toNumber();
    }

    @Input() set horizontalRelativeScrollPosition(value: number) {
        this.horizontalRelativeScrollPositionBig = new BigNumber(value);
    }

    get verticalRelativeScrollPosition(): number {
        return this._verticalRelativeScrollPositionBig.toNumber();
    }

    @Input() set verticalRelativeScrollPosition(value: number) {
        this.verticalRelativeScrollPositionBig = new BigNumber(value);
    }

    get horizontalAbsoluteScrollPosition(): number {
        return this._horizontalRelativeScrollPositionBig.times(this.horizontalScrollSize).toNumber();
    }

    @Input() set horizontalAbsoluteScrollPosition(value: number) {
        this.horizontalRelativeScrollPositionBig = new BigNumber(value).div(this.horizontalScrollSize || 1);
    }

    get verticalAbsoluteScrollPosition(): number {
        return this._verticalRelativeScrollPositionBig.times(this.verticalScrollSize).toNumber();
    }

    @Input() set verticalAbsoluteScrollPosition(value: number) {
        this.verticalRelativeScrollPositionBig = new BigNumber(value).div(this.verticalScrollSize || 1);
    }

    get isHorizontalScrollVisible() {
        return this.horizontal && this._horizontalRelativeScrollSizeBig.lt(1);
    }

    get isVerticalScrollVisible() {
        return this.vertical && this._verticalRelativeScrollSizeBig.lt(1);
    }

    ngOnInit() {
        this.needUpdate$
            .pipe(
                debounceTime(1),
                takeUntil(this.destroy$)
            )
            .subscribe(() => this.updateScrolls());
    }

    ngDoCheck(): void {
        this.needUpdate$.next();
    }

    ngAfterViewChecked(): void {
        this.needUpdate$.next();
    }

    ngAfterContentChecked(): void {
        this.needUpdate$.next();
    }

    @HostListener('window:resize', ['$event'])
    onResize($event) {
        this.updateScrolls();
    }

    onWheel(event: WheelEvent) {
        if (!this.isHorizontalScrollVisible && !this.isVerticalScrollVisible) {
            return;
        }

        event.stopPropagation();
        event.preventDefault();

        const delta = -event.deltaY || -event.detail || event.wheelDelta;
        const deltaY = delta < 0 ? this.wheelSize : -this.wheelSize;

        this.verticalRelativeScrollPositionBig = new BigNumber(deltaY).div(this.verticalScrollSize).plus(this._verticalRelativeScrollPositionBig);
    }

    updateScrolls() {
        this.el.scrollTop = this.verticalAbsoluteScrollPosition;
        this.el.scrollLeft = this.horizontalAbsoluteScrollPosition;

        this.cdr.detectChanges();
    }

    emitValues(horizontal: boolean) {
        if (horizontal) {
            this.horizontalAbsoluteScrollSizeChange.emit(this.horizontalScrollSize);
            this.horizontalRelativeScrollPositionChange.emit(this.horizontalRelativeScrollPosition);
            this.horizontalAbsoluteScrollPositionChange.emit(this.horizontalAbsoluteScrollPosition);
        } else {
            this.verticalAbsoluteScrollSizeChange.emit(this.verticalScrollSize);
            this.verticalRelativeScrollPositionChange.emit(this.verticalRelativeScrollPosition);
            this.verticalAbsoluteScrollPositionChange.emit(this.verticalAbsoluteScrollPosition);
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
