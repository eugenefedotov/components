import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user_permission')
export class UserPermissionEntity {

    @PrimaryGeneratedColumn({ unsigned: true })
    id: number;

    @Column({ unique: true, nullable: false })
    code: string;
}