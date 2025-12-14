import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import { DeliveryOnTransit } from "./DeliveryOnTransit"

@Entity("delivery_cart")
export class DeliveryCart {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  productName!: string

  @Column()
  productType!: string

  @Column()
  size!: string

  @Column("int")
  quantity!: number

  // Link to delivery_on_transit
  @ManyToOne(() => DeliveryOnTransit, (delivery) => delivery.carts, {
    onDelete: "CASCADE",
  })
  delivery!: DeliveryOnTransit
}
