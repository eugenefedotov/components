import {SelectSource} from '../select-source';
import {SelectSourceRequestModel} from '../models/select-source-request.model';
import {SelectSourceResponseModel} from '../models/select-source-response.model';
import {SelectItemModel} from '../models/select-item.model';

export class LocalSelectSource<T = any> implements SelectSource<T> {

    constructor(private items: SelectItemModel<T>[]) {

    }

    async getByValue(value: SelectItemModel['value']): Promise<SelectItemModel<T>> {
        return this.items.find(item => item.value === value);
    }

    async getData(request: SelectSourceRequestModel): Promise<SelectSourceResponseModel<T>> {
        let items = [...this.items];

        if (request.filter) {
            items = items.filter(item => item.name.includes(request.filter));
        }

        return {
            items: items.slice(request.offset, request.offset + request.limit),
            count: items.length
        };
    }

}
