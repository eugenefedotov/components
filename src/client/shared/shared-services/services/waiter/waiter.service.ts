import {ComponentFactoryResolver, ComponentRef, Injectable, Injector, Type} from '@angular/core';
import {PopUpService} from '../pop-up/pop-up.service';
import {Observable, Subject} from 'rxjs';
import {distinct} from 'rxjs/operators';
import {WaiterComponent} from '../../../shared-components/components/base/waiter/waiter.component';

let counter = 0;

export function Waiter(lock = false): MethodDecorator {
    return (object, key, descriptor: PropertyDescriptor) => {
        const originalMethod = descriptor.value;

        descriptor.value = function (...args) {
            const token = `Waiter_decorator_for_${key}_${counter++}`;

            _WaiterService.show(token);
            const terminate = () => _WaiterService.hide(token);

            try {
                const originalResult = originalMethod.apply(this, args);

                if (originalResult instanceof Promise) {
                    (originalResult as Promise<any>).then(_ => {
                        terminate();
                    }).catch(e => {
                        terminate();
                    });

                    return (originalResult as Promise<any>);

                } else if (originalResult instanceof Observable) {
                    (originalResult as Observable<any>).subscribe(null, null, () => {
                        terminate();
                    });

                    return (originalResult as Observable<any>);
                } else {
                    terminate();
                    return originalResult;
                }

            } catch (e) {
                terminate();
                throw e;
            }
        };

        return descriptor;
    };
}

enum WaiterStateEnum {
    None,
    Visible,
    VisibleAndLock
}

class _WaiterService {
    private static stack = new Map<string, boolean>();
    static readonly state$ = new Subject<WaiterStateEnum>();

    static show(key: string, lock = false) {
        this.stack.set(key, lock);
        this.updateState();
    }

    static hide(key: string) {
        this.stack.delete(key);
        this.updateState();
    }

    private static updateState() {
        const values = Array.from(this.stack.values());
        const visible = !!values.length;
        const lock = visible && values.includes(true);

        this.state$.next(visible ? (lock ? WaiterStateEnum.VisibleAndLock : WaiterStateEnum.Visible) : WaiterStateEnum.None);
    }
}

@Injectable({
    providedIn: 'root'
})
export class WaiterService {
    private waiterComponentRef: ComponentRef<WaiterComponent>;

    constructor(private resolver: ComponentFactoryResolver,
                private injector: Injector,
                private popUpService: PopUpService) {

        _WaiterService
            .state$
            .pipe(distinct())
            .subscribe(value => this.setState(value));
    }

    private setState(state: WaiterStateEnum) {
        state ? this.showWaiter(state) : this.destroyWaiter();
    }

    private showWaiter(state: WaiterStateEnum) {
        this.destroyWaiter();

        this.waiterComponentRef = this.createComponent(WaiterComponent);
        this.popUpService.insertComponent(this.waiterComponentRef, state === WaiterStateEnum.VisibleAndLock);
    }

    private destroyWaiter() {
        if (!this.waiterComponentRef) {
            return;
        }

        this.waiterComponentRef.destroy();
        this.waiterComponentRef = null;
    }

    private createComponent<T>(comp: Type<T>): ComponentRef<T> {
        const factory = this.resolver.resolveComponentFactory(comp);
        return factory.create(this.injector);
    }
}
