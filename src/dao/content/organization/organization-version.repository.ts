import {EntityRepository, Repository} from 'typeorm';
import {OrganizationVersionEntity} from './organization-version.entity';

@EntityRepository(OrganizationVersionEntity)
export class OrganizationVersionRepository extends Repository<OrganizationVersionEntity> {

}