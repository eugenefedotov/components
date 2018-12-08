import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import {BehaviorSubject, combineLatest, Observable, Subject} from 'rxjs';
import {
    distinctUntilChanged,
    filter,
    map,
    shareReplay,
    switchMap,
    take,
    takeUntil,
    withLatestFrom
} from 'rxjs/operators';
import {animate, style, transition, trigger} from '@angular/animations';
import {hasAnyChanges} from '../../../../functions/has-any-changes';
import {arrayEquals} from '../../../../functions/array-equals';
import {isBoolean} from '../../../../functions/is-boolean';

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
export class ScrollBoxComponent implements OnInit, OnInit, OnChanges, OnDestroy {
    @Input()
    wheelSize = 50;

    @Input()
    scrollHorizontal: boolean;
    @Input()
    scrollVertical: boolean;

    @Input()
    scrollBarHorizontalShow: boolean;
    @Input()
    scrollBarVerticalShow: boolean;

    @Input()
    update$: Observable<any>;

    @Input()
    scrollTop: number;
    @Input()
    scrollLeft: number;

    @Output()
    scrollTopChange = new EventEmitter<number>();
    @Output()
    scrollLeftChange = new EventEmitter<number>();

    @ViewChild('scrollContainer')
    scrollContainerRef: ElementRef<HTMLElement>;
    @ViewChild('scrollContent')
    scrollContentRef: ElementRef<HTMLElement>;

    update$$ = new BehaviorSubject<Observable<any>>(null);

    scrollVertical$ = new BehaviorSubject(true);
    scrollHorizontal$ = new BehaviorSubject(false);

    scrollBarVerticalShow$ = new BehaviorSubject(true);
    scrollBarHorizontalShow$ = new BehaviorSubject(false);

    wheelY$ = new Subject<number>();

    containerHeight$ = new BehaviorSubject(0);
    containerWidth$ = new BehaviorSubject(0);

    contentHeight$ = new BehaviorSubject(0);
    contentWidth$ = new BehaviorSubject(0);

    scrollTop$ = new BehaviorSubject(0);
    scrollLeft$ = new BehaviorSubject(0);

    overflowHeight$ = combineLatest(this.containerHeight$, this.contentHeight$)
        .pipe(
            distinctUntilChanged(arrayEquals),
            map(([containerHeight, contentHeight]) => contentHeight - containerHeight),
            distinctUntilChanged(),
            shareReplay(1)
        );
    overflowWidth$ = combineLatest(this.containerWidth$, this.contentWidth$)
        .pipe(
            distinctUntilChanged(arrayEquals),
            map(([containerWidth, contentWidth]) => contentWidth - containerWidth),
            distinctUntilChanged(),
            shareReplay(1)
        );

    relativeVerticalScrollSize$ = combineLatest(this.containerHeight$, this.contentHeight$)
        .pipe(
            distinctUntilChanged(arrayEquals),
            map(([containerHeight, contentHeight]) => Math.min(containerHeight / contentHeight, 1)),
            distinctUntilChanged()
        );

    relativeHorizontalScrollSize$ = combineLatest(this.containerWidth$, this.contentWidth$)
        .pipe(
            distinctUntilChanged(arrayEquals),
            map(([containerWidth, contentWidth]) => Math.min(containerWidth / contentWidth, 1)),
            distinctUntilChanged()
        );

    relativeVerticalScrollPosition$ = combineLatest(this.scrollTop$, this.overflowHeight$)
        .pipe(
            distinctUntilChanged(arrayEquals),
            map(([scrollTop, overflowHeight]) => scrollTop / overflowHeight),
            distinctUntilChanged()
        );

    relativeHorizontalScrollPosition$ = combineLatest(this.scrollLeft$, this.overflowWidth$)
        .pipe(
            distinctUntilChanged(arrayEquals),
            map(([scrollLeft, overflowWidth]) => scrollLeft / overflowWidth),
            distinctUntilChanged()
        );

    overflowedHeight$ = this.overflowHeight$
        .pipe(
            map((overflowHeight) => overflowHeight > 0),
            distinctUntilChanged()
        );

    overflowedWidth$ = this.overflowWidth$
        .pipe(
            map((overflowWidth) => overflowWidth > 0),
            distinctUntilChanged()
        );

    visibleVerticalScrollBar$ = combineLatest(this.scrollBarVerticalShow$, this.overflowedHeight$)
        .pipe(
            map(([scrollVerticalShow, overflowedHeight]) => scrollVerticalShow && overflowedHeight),
            distinctUntilChanged()
        );
    visibleHorizontalScrollBar$ = combineLatest(this.scrollBarHorizontalShow$, this.overflowedWidth$)
        .pipe(
            map(([scrollHorizontalShow, overflowedWidth]) => scrollHorizontalShow && overflowedWidth),
            distinctUntilChanged()
        );


    destroy$ = new Subject();

    constructor(private cdr: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.scrollLeft$
            .pipe(
                distinctUntilChanged(),
                takeUntil(this.destroy$)
            )
            .subscribe(scrollLeft => {
                this.scrollLeft = scrollLeft;
                this.scrollLeftChange.emit(this.scrollLeft);
            });
        this.scrollTop$
            .pipe(
                distinctUntilChanged(),
                takeUntil(this.destroy$)
            )
            .subscribe(scrollTop => {
                this.scrollTop = scrollTop;
                this.scrollTopChange.emit(this.scrollTop);
            });

        this.wheelY$
            .pipe(
                withLatestFrom(this.scrollTop$),
                map(([wheelY, scrollTop]) => scrollTop + wheelY),
                withLatestFrom(this.overflowHeight$),
                map(([scrollTop, overflowHeight]) => Math.max(0, Math.min(scrollTop, overflowHeight))),
                takeUntil(this.destroy$)
            )
            .subscribe((scrollTop) => {
                this.scrollTop$.next(scrollTop);
            });

        this.update$$
            .pipe(
                switchMap(update$ => update$ ? update$ : []),
                takeUntil(this.destroy$)
            )
            .subscribe(() => {
                this.updateSizes();
            });

        combineLatest(this.scrollLeft$, this.scrollTop$)
            .pipe(
                distinctUntilChanged(arrayEquals),
                takeUntil(this.destroy$)
            )
            .subscribe(([scrollLeft, scrollTop]) => {
                this.scrollContainerRef.nativeElement.scrollLeft = scrollLeft;
                this.scrollContainerRef.nativeElement.scrollTop = scrollTop;
            });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (hasAnyChanges<ScrollBoxComponent>(changes, ['update$'])) {
            this.update$$.next(this.update$);
        }
        if (hasAnyChanges<ScrollBoxComponent>(changes, ['scrollTop'])) {
            this.scrollTop$.next(this.scrollTop);
        }
        if (hasAnyChanges<ScrollBoxComponent>(changes, ['scrollLeft'])) {
            this.scrollLeft$.next(this.scrollLeft);
        }
        if (hasAnyChanges<ScrollBoxComponent>(changes, ['scrollVertical']) && isBoolean(this.scrollVertical)) {
            this.scrollVertical$.next(this.scrollVertical);
        }
        if (hasAnyChanges<ScrollBoxComponent>(changes, ['scrollHorizontal']) && isBoolean(this.scrollHorizontal)) {
            this.scrollHorizontal$.next(this.scrollHorizontal);
        }
        if (hasAnyChanges<ScrollBoxComponent>(changes, ['scrollBarVerticalShow']) && isBoolean(this.scrollBarVerticalShow)) {
            this.scrollBarVerticalShow$.next(this.scrollBarVerticalShow);
        }
        if (hasAnyChanges<ScrollBoxComponent>(changes, ['scrollBarHorizontalShow']) && isBoolean(this.scrollBarHorizontalShow)) {
            this.scrollBarHorizontalShow$.next(this.scrollBarHorizontalShow);
        }
    }


    @HostListener('window:resize', ['$event'])
    onResize($event) {
        this.updateSizes();
    }

    onWheel(event: WheelEvent) {
        event.stopPropagation();
        event.preventDefault();

        const delta = -event.deltaY || -event.detail || event.wheelDelta;
        const deltaY = delta < 0 ? this.wheelSize : -this.wheelSize;

        this.wheelY$.next(deltaY);
    }

    updateSizes() {
        const containerEl = this.scrollContainerRef.nativeElement;
        this.containerHeight$.next(containerEl.offsetHeight);
        this.containerWidth$.next(containerEl.offsetWidth);

        const contentEl = this.scrollContentRef.nativeElement;
        this.contentHeight$.next(contentEl.offsetHeight);
        this.contentWidth$.next(contentEl.offsetWidth);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    relativeVerticalScrollPositionChange(scrollTopRelative: number) {
        this.overflowHeight$
            .pipe(
                take(1)
            )
            .subscribe(overflowHeight => {
                this.scrollTop$.next(overflowHeight * scrollTopRelative);
            });
    }

    relativeHorizontalScrollPositionChange(scrollLeftRelative: number) {
        this.overflowWidth$
            .pipe(
                take(1)
            )
            .subscribe(overflowWidth => {
                this.scrollLeft$.next(overflowWidth * scrollLeftRelative);
            });
    }
}
