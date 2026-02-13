import { Router } from "express";
import { InsertCategorie } from "../controllers/categories.controller.js";
import categoriesVerification from "../midlewares/categories.midleware.js";

const router = Router()

router.post("/categories", categoriesVerification, InsertCategorie)

export default router