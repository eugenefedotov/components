import {EntityRepository, Repository} from "typeorm";
import {AuthorityScopeEntity} from "./authority-scope.entity";

@EntityRepository(AuthorityScopeEntity)
export class AuthorityScopeRepository extends Repository<AuthorityScopeEntity> {

}
