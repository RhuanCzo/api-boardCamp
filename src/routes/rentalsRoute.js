import { listRentals, insertRental } from "../controllers/rentals.controller.js"
import Router from "express"

const router = Router()

router.get("/rentals", listRentals)
router.post("/rentals", insertRental)

export default router