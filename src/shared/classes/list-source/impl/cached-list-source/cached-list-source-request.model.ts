import {ListSourceRequestModel} from '../../models/list-source-request.model';

export interface CachedListSourceRequestModel<T> extends ListSourceRequestModel<T> {
    acceptPartialResponse?: boolean;
}
