import {Authenticated, Controller, Delete, Get, Put} from '@tsed/common';

@Controller('/authentication')
export class AuthenticationController {

    @Get('')
    @Authenticated({allowGuest: true})
    async getInfo() {

    }

    @Put('')
    @Authenticated({allowGuest: true})
    async login() {

    }

    @Delete('')
    @Authenticated()
    async logout() {

    }
}