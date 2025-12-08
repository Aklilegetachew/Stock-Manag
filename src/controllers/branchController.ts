import { Request, Response } from "express"
import { BranchService } from "../services/branchService"

export class BranchController {
  static async getBranches(req: Request, res: Response) {
    try {
      const branches = await BranchService.getAllBranches()
      res.json(branches)
    } catch (err) {
      res.status(500).json({ message: "Error fetching branches", error: err })
    }
  }

  static async createBranch(req: Request, res: Response) {
    try {
      const { name, location } = req.body
      const branch = await BranchService.createBranch(name, location)
      res.status(201).json(branch)
    } catch (err) {
      res.status(500).json({ message: "Error creating branch", error: err })
    }
  }

  static async getBranchById(req: Request, res: Response) {
    try {
      const { id } = req.params
      const branch = await BranchService.getBranchById(Number(id))
      res.json(branch)
    } catch (err) {
      res.status(500).json({ message: "Error fetching branch", error: err })
    }
  }

  static async updateBranch(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { name, location } = req.body
      const branch = await BranchService.updateBranch(Number(id), name, location)
      res.json(branch)
    } catch (err) {
      res.status(500).json({ message: "Error updating branch", error: err })
    }
  }

  static async deleteBranch(req: Request, res: Response) {
    try {
      const { id } = req.params
      const branch = await BranchService.deleteBranch(Number(id))
      res.json(branch)
    } catch (err) {
      res.status(500).json({ message: "Error deleting branch", error: err })
    }
  }

  
}
