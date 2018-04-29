import {EntityRepository, Repository} from "typeorm";
import {AuthorityEntity} from "./authority.entity";

@EntityRepository(AuthorityEntity)
export class AuthorityRepository extends Repository<AuthorityEntity> {

}