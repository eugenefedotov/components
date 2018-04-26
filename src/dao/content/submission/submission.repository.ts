import {EntityRepository, Repository} from 'typeorm';
import {SubmissionEntity} from './submission.entity';

@EntityRepository(SubmissionEntity)
export class SubmissionRepository extends Repository<SubmissionEntity> {

}