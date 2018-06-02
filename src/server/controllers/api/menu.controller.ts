import {Controller, Get} from '@tsed/common';
import {getCustomRepository} from 'typeorm';
import {MenuRepository} from '../../../dao/core/menu/menu.repository';

@Controller('/menu')
export class MenuController {

    private menuRepository = getCustomRepository(MenuRepository);

    @Get('')
    getMenu() {
        return this.menuRepository.findTrees();
    }
}