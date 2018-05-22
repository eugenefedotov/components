import {Authenticated, Controller, Delete, Get, Put, Request} from '@tsed/common';
import * as Express from 'express';

@Controller('/authentication')
export class AuthenticationController {

    @Get('')
    @Authenticated({allowGuest: true})
    async getInfo(@Request() request: Express.Request) {

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