import {Service} from "typedi";
import {OrmRepository} from "typeorm-typedi-extensions";
import {UserRepository} from "../../../dao/core/auth/user/user.repository";

@Service()
export class UserService {

    constructor(@OrmRepository() private userRepository: UserRepository) {

    }

}