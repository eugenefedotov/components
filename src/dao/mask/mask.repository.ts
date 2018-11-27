import {EntityRepository, Repository} from 'typeorm';
import {MaskEntity} from './mask.entity';

@EntityRepository(MaskEntity)
export class MaskRepository extends Repository<MaskEntity> {

}
