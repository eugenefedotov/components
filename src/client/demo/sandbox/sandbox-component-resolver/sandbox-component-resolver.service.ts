import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {DEMO_COMPONENTS, DemoComponentInfo} from '../../demo.components';
import {Observable} from 'rxjs';

@Injectable()
export class SandboxComponentResolverService implements Resolve<DemoComponentInfo> {

    constructor() {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<DemoComponentInfo> | Promise<DemoComponentInfo> | DemoComponentInfo {
        return DEMO_COMPONENTS.find(info => info.name === route.params.component);
    }
}
