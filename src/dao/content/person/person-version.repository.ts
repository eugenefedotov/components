import {DeepPartial, EntityRepository, Repository, SaveOptions} from 'typeorm';
import {PersonVersionEntity} from './person-version.entity';

@EntityRepository(PersonVersionEntity)
export class PersonVersionRepository extends Repository<PersonVersionEntity> {

    save<T extends DeepPartial<PersonVersionEntity>>(entities: T[], options?: SaveOptions): Promise<T[]>;
    save<T extends DeepPartial<PersonVersionEntity>>(entity: T, options?: SaveOptions): Promise<T> {
        return super.save(entity, options);
    }
}