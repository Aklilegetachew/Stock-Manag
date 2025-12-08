import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { DeliveryStock } from "./deliveryStock"

@Entity({ name: "deliveryproducts" })
export class Deliveryproducts {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  name!: string

  @Column()
  type!: string

  @Column()
  size!: string

  @OneToMany(() => DeliveryStock, (stock) => stock.product)
  stocks!: DeliveryStock[]
}
