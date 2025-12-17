import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from "typeorm"
import bcrypt from "bcryptjs"

@Entity({ name: "stockadmins" })
export class StockAdmin {
  @PrimaryGeneratedColumn("uuid")
  id!: string

  @Column({ unique: true })
  email!: string

  @Column({ select: false })
  password_hash!: string

  @Column()
  full_name!: string

  @Column({ default: "admin" })
  role!: string

  @Column({ default: true })
  is_active!: boolean

  @Column({ nullable: true })
  last_login_at!: Date

  @CreateDateColumn()
  created_at!: Date

  @UpdateDateColumn()
  updated_at!: Date

  // This is a virtual property, not stored in DB, strictly for setting password
  private _password?: string

  set password(value: string) {
    this._password = value
    this.password_hash = bcrypt.hashSync(value, 10)
  }

  // Method to validate password
  async validatePassword(password: string): Promise<boolean> {
    if (!this.password_hash) return false
    return bcrypt.compare(password, this.password_hash)
  }
}
