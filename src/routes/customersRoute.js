import { listCustomers, listCustomersByCpf } from "../controllers/customers.controller.js"
import { Router } from "express" 

const router = Router()

router.get("/customers/:cpf", listCustomersByCpf)

export default router