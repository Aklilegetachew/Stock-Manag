import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from "typeorm"
import { DeliveryCart } from "./DeliveryCart"

export enum DeliveryStatus {
  IN_TRANSIT = "IN_TRANSIT",
  COMPLETED = "COMPLETED",
}

@Entity("delivery_on_transit")
export class DeliveryOnTransit {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  userName!: string

  @Column()
  phoneNumber!: string

  @Column()
  address!: string

  @Column()
  userTelegramId!: string

  @Column("decimal", { precision: 10, scale: 7 })
  longitude!: number

  @Column("decimal", { precision: 10, scale: 7 })
  latitude!: number

  @Column()
  transactionNumber!: string

  @Column("decimal", { precision: 10, scale: 2 })
  totalPayment!: number

  @CreateDateColumn()
  createdAt!: Date

  @Column({
    type: "enum",
    enum: DeliveryStatus,
    default: DeliveryStatus.IN_TRANSIT,
  })
  status!: DeliveryStatus

  @Column({ type: "timestamp", nullable: true })
  completedAt?: Date | null

  // Relation with DeliveryCart
  @OneToMany(() => DeliveryCart, (cart) => cart.delivery, { cascade: true })
  carts!: DeliveryCart[]
}
