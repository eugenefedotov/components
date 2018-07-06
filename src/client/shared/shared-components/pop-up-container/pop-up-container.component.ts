import {
    AfterContentChecked,
    AfterViewChecked,
    Component,
    DoCheck,
    ElementRef,
    HostBinding,
    Input,
    OnDestroy,
    OnInit,
    TemplateRef
} from '@angular/core';
import {PopUpAlign, PopUpBound, PopUpPosition} from '../../shared-directives/pop-up/pop-up.directive';
import {Subject} from 'rxjs';
import {throttleTime} from 'rxjs/operators';

@Component({
    selector: 'app-pop-up-container',
    template: '<ng-container *ngTemplateOutlet="templateRef"></ng-container>',
    styleUrls: ['./pop-up-container.component.scss']
})
export class PopUpContainerComponent implements OnInit, DoCheck, AfterViewChecked, AfterContentChecked, OnDestroy {

    @Input() templateRef: TemplateRef<any>;

    @Input() popUpRelativeHtmlElement: HTMLElement;

    @Input() popUpContentPosition: PopUpPosition;
    @Input() popUpContentAlign: PopUpAlign;

    @Input() viewportBound: PopUpBound;

    _popUpContentPosition: PopUpPosition;
    _popUpContentAlign: PopUpAlign;

    needUpdate$ = new Subject();

    @HostBinding('style.top.px')
    top: number;

    @HostBinding('style.left.px')
    left: number;

    @HostBinding('style.right.px')
    right: number;

    @HostBinding('style.bottom.px')
    bottom: number;

    @HostBinding('style.width.px')
    width: number;

    @HostBinding('style.height.px')
    height: number;

    constructor(private elementRef: ElementRef<HTMLElement>) {
    }

    @HostBinding('class.pop-up-container_position-top')
    get positionTop() {
        return this._popUpContentPosition === PopUpPosition.Top;
    }

    @HostBinding('class.pop-up-container_position-left')
    get positionLeft() {
        return this._popUpContentPosition === PopUpPosition.Left;
    }

    @HostBinding('class.pop-up-container_position-right')
    get positionRight() {
        return this._popUpContentPosition === PopUpPosition.Right;
    }

    @HostBinding('class.pop-up-container_position-bottom')
    get positionBottom() {
        return this._popUpContentPosition === PopUpPosition.Bottom;
    }

    @HostBinding('class.pop-up-container_align-start')
    get alignStart() {
        return this._popUpContentAlign === PopUpAlign.Start;
    }

    @HostBinding('class.pop-up-container_align-center')
    get alignCenter() {
        return this._popUpContentAlign === PopUpAlign.Center;
    }

    @HostBinding('class.pop-up-container_align-end')
    get alignEnd() {
        return this._popUpContentAlign === PopUpAlign.End;
    }

    @HostBinding('class.pop-up-container_align-fit-by-relative')
    get alignFitByRelative() {
        return this._popUpContentAlign === PopUpAlign.FitByRelative;
    }

    ngOnInit() {
        this.needUpdate$
            .pipe(throttleTime(50))
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
        this.needUpdate$.next();
    }

    updateAll() {
        this.updateRealContentAlign();
        this.updateRealContentPosition();
        this.updateContentStyle();
    }

    getViewportBound() {
        if (this.viewportBound) {
            return this.viewportBound;
        }

        return {
            left: 0,
            top: 0,
            right: window.innerWidth,
            bottom: window.innerHeight
        };
    }

    getRelativeBound() {
        const el = this.popUpRelativeHtmlElement;
        const bound = el.getBoundingClientRect();
        return {
            left: bound.left,
            top: bound.top,
            right: bound.right,
            bottom: bound.bottom
        };
    }

    getContentSize() {
        const el = this.elementRef.nativeElement;
        return {
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
        let isPositionHorizontal: boolean;
        const allAnchors = [PopUpPosition.Left, PopUpPosition.Right, PopUpPosition.Top, PopUpPosition.Bottom];
        const sizeProps = ['height', 'width'];

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
                isPositionHorizontal = true;
                break;
            case PopUpPosition.Right:
                positionAnchor = PopUpPosition.Left;
                isPositionHorizontal = true;
                break;
        }

        switch (this._popUpContentAlign) {
            case PopUpAlign.Start:
            case PopUpAlign.Center:
            case PopUpAlign.FitByRelative:
                alignAnchor = isPositionHorizontal ? PopUpPosition.Top : PopUpPosition.Left;
                break;
            case PopUpAlign.End:
                alignAnchor = isPositionHorizontal ? PopUpPosition.Bottom : PopUpPosition.Right;
                break;
        }

        allAnchors.forEach(anchor => {
            const anchorStyleName = this.getAnchorStyleName(anchor);
            const isPositionAnchor = positionAnchor === anchor;
            const isAlignAnchor = alignAnchor === anchor;

            if (!isPositionAnchor && !isAlignAnchor) {
                this[anchorStyleName] = null;
            }

            if (isPositionAnchor) {
                this[anchorStyleName] = this.getPositionAnchorValue(anchor);
            }

            if (isAlignAnchor) {
                this[anchorStyleName] = this.getAlignAnchorValue(anchor);
            }
        });

        if (this._popUpContentAlign === PopUpAlign.FitByRelative) {
            const sizeProp: string = isPositionHorizontal ? 'height' : 'width';
            this[sizeProp] = this.getSizeValue();
        } else {
            sizeProps.forEach(sizeProp => {
                this[sizeProp] = null;
            });
        }
    }

    ngOnDestroy(): void {
        this.needUpdate$.complete();
    }

    private getPositionAnchorValue(anchor: PopUpPosition): number {
        const viewportBound = this.getViewportBound();
        const relativeBound = this.getRelativeBound();

        switch (anchor) {
            case PopUpPosition.Left:
                return relativeBound.right;
            case PopUpPosition.Right:
                return viewportBound.right - relativeBound.left;
            case PopUpPosition.Top:
                return relativeBound.bottom;
            case PopUpPosition.Bottom:
                return viewportBound.bottom - relativeBound.top;
            default:
                return 0;
        }
    }

    private getAlignAnchorValue(anchor: PopUpPosition): number {
        const relativeBound = this.getRelativeBound();
        const contentSize = this.getContentSize();
        const isCenter = this._popUpContentAlign === PopUpAlign.Center;

        const leftOffset = isCenter ? ((relativeBound.right - relativeBound.left) / 2) - (contentSize.width / 2) : 0;
        const topOffset = isCenter ? ((relativeBound.bottom - relativeBound.top) / 2) - (contentSize.height / 2) : 0;

        switch (anchor) {
            case PopUpPosition.Left:
                return relativeBound.left + leftOffset;
            case PopUpPosition.Right:
                return relativeBound.right - leftOffset;
            case PopUpPosition.Top:
                return relativeBound.top + topOffset;
            case PopUpPosition.Bottom:
                return relativeBound.bottom - topOffset;
            default:
                return 0;
        }
    }

    private getAnchorStyleName(anchor: PopUpPosition): string {
        switch (anchor) {
            case PopUpPosition.Left:
                return 'left';
            case PopUpPosition.Right:
                return 'right';
            case PopUpPosition.Top:
                return 'top';
            case PopUpPosition.Bottom:
                return 'bottom';
        }
    }

    private getSizeValue(): number {
        const relativeBound = this.getRelativeBound();

        switch (this._popUpContentPosition) {
            case PopUpPosition.Top:
            case PopUpPosition.Bottom:
                return relativeBound.right - relativeBound.left;
            case PopUpPosition.Left:
            case PopUpPosition.Right:
                return relativeBound.bottom - relativeBound.top;
        }
    }
}
