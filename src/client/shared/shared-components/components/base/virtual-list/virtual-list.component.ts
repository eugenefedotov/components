import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Input,
    OnInit,
    QueryList,
    TemplateRef,
    ViewChild,
    ViewChildren
} from '@angular/core';
import {ListSource} from '../../../../../../shared/list-source/list-source';

@Component({
    selector: 'app-virtual-list',
    templateUrl: './virtual-list.component.html',
    styleUrls: ['./virtual-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VirtualListComponent implements OnInit {

    @Input() source: ListSource<any>;
    @Input() itemTemplate: TemplateRef<any>;

    viewItems: any[];

    @ViewChildren('viewItem') viewItemElements: QueryList<ElementRef>;

    @ViewChild('top') topElement: ElementRef<HTMLElement>;
    @ViewChild('view') viewElement: ElementRef<HTMLElement>;
    @ViewChild('bottom') bottomElement: ElementRef<HTMLElement>;

    constructor(private hostElement: ElementRef<HTMLElement>) {
    }

    ngOnInit() {
    }

    identify($index) {
        return $index;
    }
}
