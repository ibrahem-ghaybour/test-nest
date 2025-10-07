import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({default:"user"})
    role: string;

    @Column({ default: true })
    is_active: boolean;

    @Column({ nullable: true })
    avatar: string;

    @Column({ nullable: true })
    age: number;

    @Column({ nullable: true })
    gender: 'male' | "female"
}
