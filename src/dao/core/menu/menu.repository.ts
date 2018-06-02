import {EntityRepository, TreeRepository} from 'typeorm';
import {MenuEntity} from './menu.entity';

@EntityRepository(MenuEntity)
export class MenuRepository extends TreeRepository<MenuEntity> {
}
