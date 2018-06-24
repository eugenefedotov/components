import {
    AfterContentChecked,
    AfterViewChecked,
    Component,
    DoCheck,
    ElementRef,
    Input,
    NgZone,
    OnChanges,
    OnDestroy,
    OnInit,
    Renderer2,
    SimpleChanges,
    TemplateRef
} from '@angular/core';
import {PopUpAlign, PopUpBound, PopUpPosition} from '../../../shared-directives/pop-up/pop-up.directive';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';


interface PopUpSize {
    width: number;
    height: number;
}

@Component({
    selector: 'app-pop-up-container',
    template: '<ng-container *ngTemplateOutlet="templateRef"></ng-container>',
    styleUrls: ['./pop-up-container.component.scss']
})
export class PopUpContainerComponent implements OnInit, OnChanges, DoCheck, AfterViewChecked, AfterContentChecked, OnDestroy {

    @Input() templateRef: TemplateRef<any>;

    @Input() popUpRelativeHtmlElement: HTMLElement;

    @Input() popUpContentPosition: PopUpPosition;
    @Input() popUpContentAlign: PopUpAlign;

    @Input() viewportBound: PopUpBound;

    _popUpContentPosition: PopUpPosition;
    _popUpContentAlign: PopUpAlign;

    _viewportBound: PopUpBound;
    _relativeBound: PopUpBound;
    _contentSize: PopUpSize;

    needUpdate$ = new Subject();

    constructor(private elementRef: ElementRef<HTMLElement>,
                private renderer: Renderer2,
                private zone: NgZone) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        this._popUpContentPosition = this.popUpContentPosition;
        this._popUpContentAlign = this.popUpContentAlign;
    }

    ngOnInit() {
        this.renderer.setStyle(this.elementRef.nativeElement, 'top', '-10000px');
        this.renderer.setStyle(this.elementRef.nativeElement, 'left', '-10000px');

        this.needUpdate$
            .pipe(debounceTime(50))
            .subscribe(() => this.updateAll());
    }

    ngDoCheck(): void {
        this.needUpdate();
    }

    ngAfterViewChecked(): void {
        this.needUpdate();
    }

    ngAfterContentChecked(): void {
        this.needUpdate();
    }

    needUpdate() {
        this.zone.runOutsideAngular(() => {
            this.needUpdate$.next();
        });
    }

    updateAll() {
        this.getViewportBound();
        this.getRelativeBound();
        this.getContentSize();

        this.updateRealContentAlign();
        this.updateRealContentPosition();
        this.updateContentStyle();
    }

    getViewportBound() {
        if (this.viewportBound) {
            this._viewportBound = this.viewportBound;
            return;
        }

        this._viewportBound = {
            left: 0,
            top: 0,
            right: window.innerWidth,
            bottom: window.innerHeight
        };
    }

    getRelativeBound() {
        const el = this.popUpRelativeHtmlElement;
        const bound = el.getBoundingClientRect();
        this._relativeBound = {
            left: bound.left,
            top: bound.top,
            right: bound.right,
            bottom: bound.bottom
        };
    }

    getContentSize() {
        const el = this.elementRef.nativeElement;
        this._contentSize = {
            width: el.offsetWidth,
            height: el.offsetHeight
        };
    }

    updateRealContentAlign() {
        this._popUpContentAlign = this.popUpContentAlign;

    }

    updateRealContentPosition() {
        this._popUpContentPosition = this.popUpContentPosition;

    }

    updateContentStyle() {
        console.log('updateContentStyle');

        let isPositionHorizontal: boolean;
        const allAnchors = [PopUpPosition.Left, PopUpPosition.Right, PopUpPosition.Top, PopUpPosition.Bottom];

        let positionAnchor: PopUpPosition;
        let alignAnchor: PopUpPosition;

        switch (this._popUpContentPosition) {
            case PopUpPosition.Top:
                positionAnchor = PopUpPosition.Bottom;
                isPositionHorizontal = false;
                break;
            case PopUpPosition.Bottom:
                positionAnchor = PopUpPosition.Top;
                isPositionHorizontal = false;
                break;
            case PopUpPosition.Left:
                positionAnchor = PopUpPosition.Right;
                isPositionHorizontal = false;
                break;
            case PopUpPosition.Right:
                positionAnchor = PopUpPosition.Left;
                isPositionHorizontal = true;
                break;
        }

        switch (this._popUpContentAlign) {
            case PopUpAlign.Start:
            case PopUpAlign.Center:
                alignAnchor = isPositionHorizontal ? PopUpPosition.Top : PopUpPosition.Left;
                break;
            case PopUpAlign.End:
                alignAnchor = isPositionHorizontal ? PopUpPosition.Bottom : PopUpPosition.Right;
                break;
        }

        allAnchors.forEach(anchor => {
            const isPositionAnchor = positionAnchor === anchor;
            const isAlignAnchor = alignAnchor === anchor;

            if (!isPositionAnchor && !isAlignAnchor) {
                this.renderer.removeStyle(this.elementRef.nativeElement, anchor);
            }

            if (isPositionAnchor) {
                this.renderer.setStyle(this.elementRef.nativeElement, anchor, this.getPositionAnchorValue(anchor).toFixed() + 'px');
            }

            if (isAlignAnchor) {
                this.renderer.setStyle(this.elementRef.nativeElement, anchor, this.getAlignAnchorValue(anchor).toFixed() + 'px');
            }

            this.renderer.removeClass(this.elementRef.nativeElement, `pop-up-container_position-${anchor}`);
        });

        this.renderer.addClass(this.elementRef.nativeElement, `pop-up-container_position-${this._popUpContentPosition}`);
    }

    ngOnDestroy(): void {
        this.needUpdate$.complete();
    }

    private getPositionAnchorValue(anchor: PopUpPosition): number {
        switch (anchor) {
            case PopUpPosition.Left:
                return this._relativeBound.right;
            case PopUpPosition.Right:
                return this._viewportBound.right - this._relativeBound.left;
            case PopUpPosition.Top:
                return this._relativeBound.bottom;
            case PopUpPosition.Bottom:
                return this._viewportBound.bottom - this._relativeBound.top;
            default:
                return 0;
        }
    }

    private getAlignAnchorValue(anchor: PopUpPosition): number {
        const isCenter = this._popUpContentAlign === PopUpAlign.Center;

        const leftOffset = isCenter ? ((this._relativeBound.right - this._relativeBound.left) / 2) - (this._contentSize.width / 2) : 0;
        const topOffset = isCenter ? ((this._relativeBound.bottom - this._relativeBound.top) / 2) - (this._contentSize.height / 2) : 0;

        switch (anchor) {
            case PopUpPosition.Left:
                return this._relativeBound.left + leftOffset;
            case PopUpPosition.Right:
                return this._relativeBound.right - leftOffset;
            case PopUpPosition.Top:
                return this._relativeBound.top + topOffset;
            case PopUpPosition.Bottom:
                return this._relativeBound.bottom - topOffset;
            default:
                return 0;
        }
    }
}
