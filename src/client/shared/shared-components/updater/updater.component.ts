import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {of, Subject} from 'rxjs';
import {filter, repeat, takeUntil} from 'rxjs/operators';
import {animationFrame} from 'rxjs/internal/scheduler/animationFrame';

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
        of(animationFrame.now(), animationFrame)
            .pipe(
                repeat(),
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

        this.cdr.detectChanges();
    }

    private needUpdate() {
        this.progress = 0;
        this.startTime = null;
        this.update.emit();
    }
}
