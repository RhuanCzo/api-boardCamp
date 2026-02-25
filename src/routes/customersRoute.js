import { listCustomers, listCustomersById, insertCustomer, updateCustomers } from "../controllers/customers.controller.js"
import { Router } from "express" 

const router = Router()

router.get("/customers", listCustomers)
router.get("/customers/:id", listCustomersById)
router.post("/customers", insertCustomer)
router.put("/customers/:id", updateCustomers)

export default router