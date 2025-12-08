import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { DeliveryStock } from "./deliveryStock"

@Entity({ name: "branches" })
export class Branches {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  name!: string

  @Column({ nullable: true })
  location!: string

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date

  @OneToMany(() => DeliveryStock, (stock) => stock.branch)
  stocks!: DeliveryStock[]
}
