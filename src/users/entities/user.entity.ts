import { Column, Entity, PrimaryGeneratedColumn, Index, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
@Index(['role', 'is_active'])
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @Column()
    name: string;

    @Index()
    @Column({ unique: true })
    email: string;

    @Column({select: false})
    password: string;

    @Column({ default: "user" })
    role: string;

    @Column({ default: true })
    is_active: boolean;

    @Column({ nullable: true })
    avatar: string;

    @Column({ nullable: true })
    age: number;

    @Column({
        nullable: true,
        type: 'enum',
        enum: ['male', 'female'],
    })
    gender?: 'male' | "female"

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
