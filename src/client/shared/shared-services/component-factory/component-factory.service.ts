import {ComponentFactoryResolver, ComponentRef, Injectable, Injector, Type} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ComponentFactoryService {

    constructor(private resolver: ComponentFactoryResolver,
                private injector: Injector) {
    }

    createComponent<T>(comp: Type<T>): ComponentRef<T> {
        const factory = this.resolver.resolveComponentFactory(comp);
        return factory.create(this.injector);
    }
}
