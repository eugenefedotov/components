import {ListSourceResponseModel} from '../../models/list-source-response.model';

export interface CachedListSourceResponseModel<T> extends ListSourceResponseModel<T> {
    partial: boolean;
}
