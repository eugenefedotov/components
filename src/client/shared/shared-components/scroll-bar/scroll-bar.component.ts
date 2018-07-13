import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    HostBinding,
    Inject,
    Input,
    OnDestroy,
    OnInit,
    Output
} from '@angular/core';
import {DOCUMENT} from '@angular/common';

@Component({
    selector: 'app-scroll-bar',
    templateUrl: './scroll-bar.component.html',
    styleUrls: ['./scroll-bar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScrollBarComponent implements OnInit, OnDestroy {
    @Input() horizontal = false;
    @Input() size = 1;
    @Input() position = 0;
    @Output() positionChange = new EventEmitter<number>();

    @HostBinding('class.scroll-bar_other-scroll-visible')
    @Input() otherScrollVisible = false;

    moving = false;
    moveStartAbsolutePosition: number;
    moveStartRelativePosition: number;
    mouseMoveListener = this.onMouseMove.bind(this);
    mouseUpListener = this.onMouseUp.bind(this);

    constructor(@Inject(DOCUMENT) private document: Document,
                private changeDetectorRef: ChangeDetectorRef,
                private elementRef: ElementRef<HTMLElement>) {
    }

    @HostBinding('class.scroll-bar_horizontal') get isHorizontal() {
        return this.horizontal;
    }

    @HostBinding('class.scroll-bar_vertical') get isVertical() {
        return !this.horizontal;
    }

    get sliderWidth() {
        return this.isHorizontal && this.size * 100;
    }

    get sliderHeight() {
        return this.isVertical && this.size * 100;
    }

    get sliderLeft() {
        return this.isHorizontal && (1 - this.size) * this.position * 100;
    }

    get sliderTop() {
        return this.isVertical && (1 - this.size) * this.position * 100;
    }

    ngOnInit() {
    }

    getEventAbsolutePosition(event: MouseEvent): number {
        const prop = this.horizontal ? 'pageX' : 'pageY';
        return event[prop];
    }

    get100PcSize(): number {
        const prop = this.horizontal ? 'offsetWidth' : 'offsetHeight';
        return this.elementRef.nativeElement[prop];
    }

    beginMove() {
        if (this.moving) {
            return;
        }

        this.moving = true;
        this.document.body.addEventListener('mousemove', this.mouseMoveListener, true);
        this.document.body.addEventListener('mouseup', this.mouseUpListener, true);
    }

    endMove() {
        if (!this.moving) {
            return;
        }

        this.moving = false;
        this.document.body.removeEventListener('mousemove', this.mouseMoveListener, true);
        this.document.body.removeEventListener('mouseup', this.mouseUpListener, true);
    }

    onMouseDown(event: MouseEvent) {
        event.preventDefault();
        event.stopPropagation();

        this.beginMove();

        this.moveStartAbsolutePosition = this.getEventAbsolutePosition(event);
        this.moveStartRelativePosition = this.position;
    }

    onMouseMove(event: MouseEvent) {
        event.preventDefault();
        event.stopPropagation();

        const moveAbsolutePosition = this.getEventAbsolutePosition(event);
        const moveOffsetAbsolutePosition = this.moveStartAbsolutePosition - moveAbsolutePosition;

        const absSliderSize = this.get100PcSize() * (1 - this.size);

        const mouseMovePositionRelativeOffset = moveOffsetAbsolutePosition / absSliderSize;

        this.setPosition(this.moveStartRelativePosition - mouseMovePositionRelativeOffset);

        this.changeDetectorRef.detectChanges();
    }

    onMouseUp(event: MouseEvent) {
        event.preventDefault();
        event.stopPropagation();
        this.endMove();
        this.changeDetectorRef.detectChanges();
    }

    setPosition(position: number) {
        position = Math.max(0, Math.min(1, position));

        if (this.position === position) {
            return;
        }

        this.position = position;
        this.positionChange.emit(this.position);
    }

    ngOnDestroy() {
        this.endMove();
    }

}
