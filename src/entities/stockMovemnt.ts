import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm"
import { DeliveryStock } from "./deliveryStock"

export enum MovementType {
  ADD = "ADD",
  DEDUCT = "DEDUCT",
}

@Entity({ name: "stockmovemnt" })
export class StockMovemnt {
  @PrimaryGeneratedColumn()
  id!: number

  @ManyToOne(() => DeliveryStock, (stock) => stock.movements)
  deliveryStock!: DeliveryStock

  @Column({ type: "int" })
  quantity!: number

  @Column({
    type: "enum",
    enum: MovementType,
  })
  type!: MovementType

  @Column({ nullable: true })
  remark?: string // optional note

  @CreateDateColumn()
  createdAt!: Date

  @Column({ nullable: true })
  TransactionNumber?: string // optional note
}
