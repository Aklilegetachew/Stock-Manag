import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from "typeorm"
import { Branches } from "./branches"
import { Deliveryproducts } from "./Deliveryproducts"
import { StockMovemnt } from "./stockMovemnt"

@Entity({ name: "deliverystock" })
export class DeliveryStock {
  @PrimaryGeneratedColumn()
  id!: number

  @ManyToOne(() => Deliveryproducts, (product) => product.stocks)
  product!: Deliveryproducts

  @ManyToOne(() => Branches, (branch) => branch.stocks)
  branch!: Branches

  @Column({ type: "int", default: 0 })
  quantity!: number

  @OneToMany(() => StockMovemnt, (movement) => movement.deliveryStock)
  movements?: StockMovemnt[]
}
