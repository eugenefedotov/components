import {EntityRepository, Repository} from 'typeorm';
import {ProofVersionEntity} from './proof-version.entity';

@EntityRepository(ProofVersionEntity)
export class ProofVersionRepository extends Repository<ProofVersionEntity> {

}