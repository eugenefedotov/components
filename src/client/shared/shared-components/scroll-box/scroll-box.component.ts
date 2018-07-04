import {
    AfterContentChecked,
    AfterViewChecked,
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    Input, OnChanges,
    OnInit,
    Output, SimpleChanges,
    ViewChild
} from '@angular/core';

@Component({
    selector: 'app-scroll-box',
    templateUrl: './scroll-box.component.html',
    styleUrls: ['./scroll-box.component.scss']
})
export class ScrollBoxComponent implements OnInit, OnChanges, AfterViewChecked, AfterContentChecked {
    @Input() wheelSize = 50;

    @Input() horizontal = false;

    @Input() vertical = true;

    @Input() horizontalRelativeScrollPosition = 0;
    @Output() horizontalRelativeScrollPositionChange = new EventEmitter<number>();

    @Input() horizontalAbsoluteScrollPosition = 0;
    @Output() horizontalAbsoluteScrollPositionChange = new EventEmitter<number>();

    @Input() verticalRelativeScrollPosition = 0;
    @Output() verticalRelativeScrollPositionChange = new EventEmitter<number>();

    @Input() verticalAbsoluteScrollPosition = 0;
    @Output() verticalAbsoluteScrollPositionChange = new EventEmitter<number>();

    horizontalRelativeScrollSize = 1;
    verticalRelativeScrollSize = 1;

    @Output() horizontalRelativeScrollSizeChange = new EventEmitter<number>();
    @Output() verticalRelativeScrollSizeChange = new EventEmitter<number>();

    @Output() horizontalAbsoluteScrollSizeChange = new EventEmitter<number>();
    @Output() verticalAbsoluteScrollSizeChange = new EventEmitter<number>();

    @ViewChild('scrollContainer') scrollContainerRef: ElementRef<HTMLElement>;

    constructor() {
    }

    get isHorizontalScrollVisible() {
        return this.horizontal && this.horizontalRelativeScrollSize < 1;
    }

    get isVerticalScrollVisible() {
        return this.vertical && this.verticalRelativeScrollSize < 1;
    }

    ngOnChanges(changes: SimpleChanges): void {
        // todo обработать установку абсолютного скролла
    }

    ngOnInit() {
    }

    ngAfterViewChecked(): void {
        this.updateScrolls();
    }

    ngAfterContentChecked(): void {
        this.updateScrolls();
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

        const el = this.scrollContainerRef.nativeElement;
        const verticalScrollSize = el.scrollHeight - el.offsetHeight;

        const delta = -event.deltaY || -event.detail || event.wheelDelta;
        const deltaY = delta < 0 ? this.wheelSize : -this.wheelSize;

        const position = this.verticalRelativeScrollPosition + deltaY / verticalScrollSize;

        this.setVerticalRelativeScrollPosition(position);
    }

    onScrollBarVerticalRelativeScrollPositionChange(position: number) {
        this.setVerticalRelativeScrollPosition(position);
    }

    onScrollBarHorizontalRelativeScrollPositionChange(position: number) {
        this.setHorizontalRelativeScrollPosition(position);
    }

    setVerticalRelativeScrollPosition(position: number) {
        position = Math.max(Math.min(position, 1), 0);

        if (this.verticalRelativeScrollPosition === position) {
            return;
        }

        this.verticalRelativeScrollPosition = position;
        this.verticalRelativeScrollPositionChange.emit(this.verticalRelativeScrollPosition);

        this.updateAbsoluteScrollPosition();
    }

    setHorizontalRelativeScrollPosition(position: number) {
        position = Math.max(Math.min(position, 1), 0);

        if (this.horizontalRelativeScrollPosition === position) {
            return;
        }

        this.horizontalRelativeScrollPosition = position;
        this.horizontalRelativeScrollPositionChange.emit(this.horizontalRelativeScrollPosition);

        this.updateAbsoluteScrollPosition();
    }

    updateScrolls() {
        this.updateScrollSizes();
        this.updateAbsoluteScrollPosition();
    }

    updateScrollSizes() {
        const el = this.scrollContainerRef.nativeElement;

        const verticalScrollSize = el.offsetHeight / el.scrollHeight;
        const horizontalScrollSize = el.offsetWidth / el.scrollWidth;

        if (this.verticalRelativeScrollSize !== verticalScrollSize) {
            this.verticalRelativeScrollSize = verticalScrollSize;
            this.verticalRelativeScrollSizeChange.emit(this.verticalRelativeScrollSize);
            this.verticalAbsoluteScrollSizeChange.emit(el.scrollHeight);
        }

        if (this.horizontalRelativeScrollSize !== horizontalScrollSize) {
            this.horizontalRelativeScrollSize = horizontalScrollSize;
            this.horizontalRelativeScrollSizeChange.emit(this.horizontalRelativeScrollSize);
            this.horizontalAbsoluteScrollSizeChange.emit(el.scrollWidth);
        }
    }

    updateAbsoluteScrollPosition() {
        const el = this.scrollContainerRef.nativeElement;

        const horizontalScrollSize = el.scrollWidth - el.offsetWidth;
        const verticalScrollSize = el.scrollHeight - el.offsetHeight;

        const horizontalAbsoluteScrollPosition = horizontalScrollSize * this.horizontalRelativeScrollPosition;
        const verticalAbsoluteScrollPosition = verticalScrollSize * this.verticalRelativeScrollPosition;

        if (el.scrollLeft !== horizontalAbsoluteScrollPosition) {
            el.scrollLeft = horizontalAbsoluteScrollPosition;
            this.horizontalAbsoluteScrollPositionChange.emit(el.scrollLeft);
        }

        if (el.scrollTop !== verticalAbsoluteScrollPosition) {
            el.scrollTop = verticalAbsoluteScrollPosition;
            this.verticalAbsoluteScrollPositionChange.emit(el.scrollTop);
        }

    }

}
