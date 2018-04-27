import {EntityRepository, Repository} from 'typeorm';
import {PersonEntity} from './person.entity';
import {PersonVersionRepository} from "./person-version.repository";

@EntityRepository(PersonEntity)
export class PersonRepository extends Repository<PersonEntity> {

    async saveCurrentVersion(person: PersonEntity): Promise<PersonEntity> {
        let savedPerson = await this.findOne(person.id);

        if (!savedPerson) {
            savedPerson = this.create();
        }

        savedPerson.currentVersion.person = savedPerson;
        savedPerson.currentVersion = await this.manager.getCustomRepository(PersonVersionRepository).save(person.currentVersion);

        return this.save(savedPerson);
    }

}