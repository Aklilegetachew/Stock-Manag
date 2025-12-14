
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
} from "typeorm";

export enum DeliveryStatus {
    ON_THE_WAY = "IN_TRANSIT",
    COMPLETED = "COMPLETED",
}

@Entity("delivery_on_transit")
export class DeliveryOnTransit {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    userName!: string;

    @Column()
    userTelegramId!: string;

    @Column("decimal", { precision: 10, scale: 7 })
    longitude!: number;

    @Column("decimal", { precision: 10, scale: 7 })
    latitude!: number;

    @Column()
    cartId!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @Column({
        type: "enum",
        enum: DeliveryStatus,
        default: DeliveryStatus.ON_THE_WAY,
    })
    status!: DeliveryStatus;

    @Column({ type: "timestamp", nullable: true })
    completedAt?: Date | null;
}
