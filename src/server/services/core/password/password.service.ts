import {md5} from '../../../../functions/md5';
import {Service} from '@tsed/common';
import {SettingsService} from '../settings/settings.service';

@Service()
export class PasswordService {

    constructor(private settingsService: SettingsService) {

    }

    async getSalt(): Promise<string> {
        return (await this.settingsService.get()).private.salt;
    }

    async getHash(password: string): Promise<string> {
        return md5(password + (await this.getSalt()));
    }
}