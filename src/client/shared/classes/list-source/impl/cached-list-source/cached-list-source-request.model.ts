import {ListSourceRequestModel} from '../../models/list-source-request.model';

export interface CachedListSourceRequestModel extends ListSourceRequestModel {
    acceptPartialResponse?: boolean;
}
