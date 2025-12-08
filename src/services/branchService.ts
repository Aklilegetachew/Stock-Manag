import { AppDataSource } from "../data-source"
import { Branches } from "../entities/branches"
const branchRepository = AppDataSource.getRepository(Branches)
export class BranchService {
  static async getAllBranches() {
    return branchRepository.find()
  }

  static async createBranch(name: string, location?: string) {
    const branch = branchRepository.create({ name, location })
    return branchRepository.save(branch)
  }

  static async getBranchById(id: number) {
    return branchRepository.findOne({ where: { id } })
  }

  static async updateBranch(id: number, name: string, location?: string) {
    const branch = await branchRepository.findOne({ where: { id } })
    if (!branch) {
      throw new Error("Branch not found")
    }
    branch.name = name
    if (location !== undefined) {
      branch.location = location
    }
    return branchRepository.save(branch)
  }

  static async deleteBranch(id: number) {
    const branch = await branchRepository.findOne({ where: { id } })
    if (!branch) {
      throw new Error("Branch not found")
    }
    return branchRepository.remove(branch)
  }
}
