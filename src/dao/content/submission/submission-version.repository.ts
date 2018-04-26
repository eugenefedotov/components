import {EntityRepository, Repository} from 'typeorm';
import {SubmissionVersionEntity} from './submission-version.entity';

@EntityRepository(SubmissionVersionEntity)
export class SubmissionVersionRepository extends Repository<SubmissionVersionEntity> {

}
