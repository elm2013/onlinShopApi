import { User } from "src/module/users/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
/* currency is Toman*/
@Entity()
export class Transaction {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User)
    @JoinColumn()
    user: User

    @Column()
    mode: string//افزایشی یا کاهشی

    @Column()
    gateway: string//حرید یا شارزکیف پول

    @Column()
    method: string//پرداخت باکیف پول یا پرداخت آنلاین 

    @Column()
    status: string/* pending, failed, complet */

    @Column()
    amount: number

    // @Column()
    // currency: string //rial

    @Column()
    description: string

    @Column()
    authority: string

    @Column()
    traceNo: string//کد پیگری

    @Column({ default: new Date().toISOString() })
    createDate: Date

}