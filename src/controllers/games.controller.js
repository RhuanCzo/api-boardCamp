import db from "../database/db.js"

export async function getGames(req, res) {

    try {
        const listGames = await db.query('SELECT * FROM games;')
        res.send(listGames.rows)
    } catch (err) {
        console.log(err)
        res.sendStatus(400)
    }
}

export async function getGamesByName(req, res) {
    const {name} = req.params
    console.log(name)
    
    try {
        const listGames = await db.query('SELECT * FROM games WHERE name ILIKE $1;', [`%${name}%`])

        if (!listGames.rows[0]) {
            return res.sendStatus(404) // jogo não encontrado
        }

        res.send(listGames.rows[0])
    } catch (err) {
        console.log(err)
        res.sendStatus(500) // erro no servidor
    }
}

export async function addGames (req, res) {
    const game = req.body

    if (game.name === null) {
        return res.sendStatus(400)
    }
    if(game.stockTotal < 0) {
        return res.sendStatus(400)
    }
    if(game.pricePerDay < 0) {
        return res.sendStatus(400)
    }

    try {
        
        await db.query(
            `INSERT
             INTO
              games (name, image, stockTotal, categoryId, pricePerDay) 
              VALUES ($1,$2,$3,$4,$5)
              ON CONFLICT (name) DO NOTHING`,
              [game.name, game.image, game.stockTotal, game.categoryId, game.pricePerDay])
        res.sendStatus(201)
    } catch (err) {
        console.log(err)
        res.sendStatus(401)
    }

}