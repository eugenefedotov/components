import {EntityRepository, Repository} from "typeorm";
import {UserSessionConnectEntity} from "./user-session-connect.entity";

@EntityRepository(UserSessionConnectEntity)
export class UserSessionConnectRepository extends Repository<UserSessionConnectEntity> {

}