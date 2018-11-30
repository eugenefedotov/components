import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {interval, Subject} from 'rxjs';
import {filter, takeUntil} from 'rxjs/operators';

@Component({
    selector: 'app-updater',
    templateUrl: './updater.component.html',
    styleUrls: ['./updater.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpdaterComponent implements OnInit, OnDestroy {

    @Input()
    intervalSec: number;

    @Input()
    updating: boolean;

    @Output()
    update = new EventEmitter();

    progress: number;
    startTime: number;
    endTime: number;

    private destroy$ = new Subject();

    constructor(private cdr: ChangeDetectorRef) {
    }

    ngOnInit() {
        interval(30)
            .pipe(
                filter(() => !this.updating),
                takeUntil(this.destroy$)
            )
            .subscribe(() => this.tick());
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    onUpdateClick() {
        this.needUpdate();
    }

    private tick() {
        const currTime = Date.now();

        if (!this.startTime) {
            this.startTime = currTime;
            this.endTime = currTime + this.intervalSec * 1000;
        }

        this.progress = Math.min((currTime - this.startTime) / (this.intervalSec * 1000), 1);

        if (this.progress === 1) {
            this.needUpdate();
        }

        this.cdr.markForCheck();
    }

    private needUpdate() {
        this.progress = 0;
        this.startTime = null;
        this.update.emit();
    }
}
