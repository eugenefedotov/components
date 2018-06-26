import {
    Component, ComponentFactory,
    ComponentFactoryResolver,
    ComponentRef,
    Injector,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
    Type
} from '@angular/core';

@Component({
    selector: 'app-sandbox',
    templateUrl: './sandbox.component.html',
    styleUrls: ['./sandbox.component.scss']
})
export class SandboxComponent<T = any> implements OnInit, OnChanges, OnDestroy {

    @Input() componentType: Type<T>;

    componentFactory: ComponentFactory<T>;
    component: ComponentRef<T>;

    constructor(private resolver: ComponentFactoryResolver,
                private injector: Injector) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.hasOwnProperty('componentType')) {
            this.updateComponent();
        }
    }

    ngOnInit() {
    }

    destroyComponent() {
        if (this.component) {
            this.component.destroy();
            this.component = null;
        }
    }

    ngOnDestroy(): void {
        this.destroyComponent();
    }

    private updateComponent() {
        this.destroyComponent();

        if (this.componentType) {
            this.createFactory();
        }

        if (this.componentFactory) {
            this.createComponent();
        }
    }

    createFactory() {
        this.componentFactory = this.resolver.resolveComponentFactory(this.componentType);
    }

    createComponent() {
        this.component = this.componentFactory.create(this.injector);
    }
}
