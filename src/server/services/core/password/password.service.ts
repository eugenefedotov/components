import {md5} from '../../../../functions/md5';
import {Service} from '@tsed/common';

@Service()
export class PasswordService {

    getHash(password: string): string {
        return md5(password);
    }
}