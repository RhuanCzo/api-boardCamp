import { Router } from "express"
import { addGames, getGames, getGamesByName } from "../controllers/games.controller.js"

const router = Router()

router.get("/games/:name", getGamesByName)
router.get("/games", getGames)
router.post("/games", addGames)

export default router
