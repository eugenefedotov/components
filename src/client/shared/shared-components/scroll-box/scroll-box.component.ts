import {
    AfterContentChecked,
    AfterViewChecked,
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    OnInit,
    Output,
    ViewChild
} from '@angular/core';

@Component({
    selector: 'app-scroll-box',
    templateUrl: './scroll-box.component.html',
    styleUrls: ['./scroll-box.component.scss']
})
export class ScrollBoxComponent implements OnInit, AfterViewChecked, AfterContentChecked {
    @Input() wheelSize = 50;
    @Input() horizontal = false;
    @Input() vertical = true;
    @Input() horizontalRelativeScrollPosition = 0;
    @Input() verticalRelativeScrollPosition = 0;
    @Output() horizontalRelativeScrollPositionChange = new EventEmitter<number>();
    @Output() verticalRelativeScrollPositionChange = new EventEmitter<number>();
    horizontalScrollSize = 1;
    verticalScrollSize = 1;
    @ViewChild('scrollContainer') scrollContainerRef: ElementRef<HTMLElement>;

    constructor() {
    }

    get isHorizontalScrollVisible() {
        return this.horizontal && this.horizontalScrollSize < 1;
    }

    get isVerticalScrollVisible() {
        return this.vertical && this.verticalScrollSize < 1;
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

        this.verticalScrollSize = el.offsetHeight / el.scrollHeight;
        this.horizontalScrollSize = el.offsetWidth / el.scrollWidth;
    }

    updateAbsoluteScrollPosition() {
        const el = this.scrollContainerRef.nativeElement;

        const horizontalScrollSize = el.scrollWidth - el.offsetWidth;
        const verticalScrollSize = el.scrollHeight - el.offsetHeight;

        el.scrollLeft = horizontalScrollSize * this.horizontalRelativeScrollPosition;
        el.scrollTop = verticalScrollSize * this.verticalRelativeScrollPosition;
    }

}
