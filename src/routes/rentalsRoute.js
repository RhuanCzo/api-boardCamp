import { listRentals, insertRental, finishRental } from "../controllers/rentals.controller.js"
import Router from "express"

const router = Router()

router.get("/rentals", listRentals)
router.post("/rentals", insertRental)
router.post("/rentals/:id/return", finishRental)
router.delete("/rentals/:id", deleteRental)

export default router