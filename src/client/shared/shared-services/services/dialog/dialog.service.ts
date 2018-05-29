import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class DialogService {

    constructor() {

    }

    async openInfo(): Promise<void> {

    }

    async openError(): Promise<void> {

    }

    async openConfirm(): Promise<boolean> {
        return true;
    }
}
