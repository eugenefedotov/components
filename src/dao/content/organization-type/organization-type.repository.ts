import {EntityRepository, Repository} from "typeorm";
import {OrganizationTypeEntity} from "./organization-type.entity";

@EntityRepository(OrganizationTypeEntity)
export class OrganizationTypeRepository extends Repository<OrganizationTypeEntity> {

}