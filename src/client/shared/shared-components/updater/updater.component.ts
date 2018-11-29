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
import {BehaviorSubject, combineLatest, interval, Subject} from 'rxjs';
import {takeUntil, withLatestFrom} from 'rxjs/operators';

@Component({
    selector: 'app-updater',
    templateUrl: './updater.component.html',
    styleUrls: ['./updater.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpdaterComponent implements OnInit, OnChanges, OnDestroy {

    @Input()
    interval: number;

    @Input()
    updating: boolean;

    @Output()
    update = new EventEmitter();

    private interval$ = new BehaviorSubject<number>(5);
    private updating$ = new BehaviorSubject<boolean>(false);
    private unsubscribe$ = new Subject();
    private destroy$ = new Subject();

    constructor(private cdr: ChangeDetectorRef) {
    }

    ngOnInit() {
        combineLatest(
            this.interval$,
            this.updating$
        )
            .pipe(
                withLatestFrom(interval(100)),
                takeUntil(this.destroy$)
            )
            .subscribe(([[_interval, updating], intervalResult]) => {
                console.log({_interval, updating, intervalResult});
            });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.hasOwnProperty('interval')) {
            this.interval$.next(changes.interval.currentValue);
        }
        if (changes.hasOwnProperty('updating')) {
            this.updating$.next(changes.updating.currentValue);
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

}
