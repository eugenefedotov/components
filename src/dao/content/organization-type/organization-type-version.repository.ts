import {EntityRepository, Repository} from "typeorm";
import {OrganizationTypeVersionEntity} from "./organization-type-version.entity";

@EntityRepository(OrganizationTypeVersionEntity)
export class OrganizationTypeVersionRepository extends Repository<OrganizationTypeVersionEntity> {

}