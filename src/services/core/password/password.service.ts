import {Service} from "typedi";
import {md5} from "../../../functions/md5";

@Service()
export class PasswordService {

    getHash(password: string): string {
        return md5(password);
    }
}