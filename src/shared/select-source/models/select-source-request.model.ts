import {ListSourceRequestModel} from '../../list-source/models/list-source-request.model';

export interface SelectSourceRequestModel extends ListSourceRequestModel {
    filter?: string;
}
