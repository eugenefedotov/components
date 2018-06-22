import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/internal/Observable';
import {MenuEntity} from '../../../../dao/core/menu/menu.entity';

@Injectable({
    providedIn: 'root'
})
export class RestMenuService {

    constructor(private httpClient: HttpClient) {
    }

    getMenu(): Observable<MenuEntity[]> {
        return this.httpClient.get<MenuEntity[]>('/api/menu');
    }
}
