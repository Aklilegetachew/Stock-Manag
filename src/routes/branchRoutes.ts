import { Router } from "express"
import { BranchController } from "../controllers/branchController"

const router = Router()

router.get("/", BranchController.getBranches)
router.post("/", BranchController.createBranch)
router.get("/:id", BranchController.getBranchById)
router.put("/:id", BranchController.updateBranch)
router.delete("/:id", BranchController.deleteBranch)

export default router
