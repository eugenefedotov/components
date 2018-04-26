import {EntityRepository, Repository} from 'typeorm';
import {ProofEntity} from './proof.entity';

@EntityRepository(ProofEntity)
export class ProofRepository extends Repository<ProofEntity> {

}