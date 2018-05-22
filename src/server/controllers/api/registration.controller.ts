import {Controller, Get, PathParams} from '@tsed/common';
import {UserService} from '../../services/core/user/user.service';
import {SettingsService} from '../../services/core/settings/settings.service';

@Controller('/registration')
export class RegistrationController {

    constructor(private userService: UserService,
                private settingsService: SettingsService) {

    }

    @Get('/settings')
    async getSettings() {
        const settings = await this.settingsService.get();
        return settings.registration;
    }

    @Get('/has-user/:login')
    async hasUser(@PathParams('login') login: string): Promise<boolean> {
        return this.userService.hasUser(login);
    }

}