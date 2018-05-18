import {Service} from "typedi";
import {OrmRepository} from "typeorm-typedi-extensions";
import {UserRepository} from "../../../dao/core/auth/user/user.repository";
import {UserEntity} from "../../../dao/core/auth/user/user.entity";
import {UserNotFoundException} from "./exceptions/user-not-found.exception";
import {UserLoginAlreadyInUseException} from "./exceptions/user-login-already-in-use.exception";
import {PasswordService} from "../password/password.service";

@Service()
export class UserService {

    constructor(@OrmRepository() private userRepository: UserRepository,
                private passwordService: PasswordService) {

    }

    async hasUser(login: string): Promise<boolean> {
        return !!await this.userRepository.findOne({
            where: {
                login
            }
        });
    }

    async getUserByLogin(login: string): Promise<UserEntity> {
        const user = await this.userRepository.findOne({
            where: {
                login
            }
        });

        if (!user) {
            throw new UserNotFoundException();
        }

        return user;
    }

    async createUser(login: string, password: string): Promise<UserEntity> {
        if (await this.hasUser(login)) {
            throw new UserLoginAlreadyInUseException()
        }

        const user = this.userRepository.create({
            login: login,
            passwordHash: this.passwordService.getHash(password)
        });

        return this.userRepository.save(user);
    }

}