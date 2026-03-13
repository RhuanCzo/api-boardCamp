import db from "../database/db.js"

export async function listRentals(req, res) {
    const { customerId } = req.query
    const { gameId } = req.query

    try {
        if (customerId) {
            const rentalsByCustomerId = await db.query(`SELECT rentals.*, customers.id AS "customerId", customers.name AS "customerName", games.id AS "gameId", games.name, games.categoryid, categories.name AS "categoryName" FROM rentals JOIN customers ON rentals.customerid = customers.id JOIN games ON rentals.gameid = games.id JOIN categories ON games.categoryid = categories.id WHERE rentals.customerid = $1;`, [customerId])
            return res.send(rentalsByCustomerId.rows)
        }
        if (gameId) {
            const rentalsByGameId = await db.query(`SELECT rentals.*, customers.id AS "customerId", customers.name AS "customerName", games.id AS "gameId", games.name, games.categoryid, categories.name AS "categoryName" FROM rentals JOIN customers ON rentals.customerid = customers.id JOIN games ON rentals.gameid = games.id JOIN categories ON games.categoryid = categories.id WHERE games.id = $1;`, [gameId])
            return res.send(rentalsByGameId.rows)
        }
        const rentals = await db.query(`SELECT rentals.*, customers.id AS "customerId", customers.name AS "customerName", games.id AS "gameId", games.name, games.categoryid, categories.name AS "categoryName" FROM rentals JOIN customers ON rentals.customerid = customers.id JOIN games ON rentals.gameid = games.id JOIN categories ON games.categoryid = categories.id;`)
        return res.send(rentals.rows)
    } catch (err) {
        console.log(err)
        res.sendStatus(401)
    }
}

export async function insertRental(req, res) {
    const { customerId, gameId, daysRented } = req.body

    try {
        const customerExist = await db.query(`SELECT * FROM customers WHERE id = $1;`, [customerId])
        const gameExist = await db.query(`SELECT * FROM games WHERE id = $1;`, [gameId])
        const gameData = gameExist.rows[0]
        const rentalsOpen = await db.query(`SELECT * FROM rentals WHERE gameid = $1 AND returndate IS NULL;`, [gameId])

        if (customerExist.rows.length === 0) {
            return res.sendStatus(400)
        }
        if (gameExist.rows.length === 0) {
            return res.sendStatus(400)
        }
        if (daysRented <= 0) {
            return res.sendStatus(400)
        }
        if (rentalsOpen.rows.length >= gameData.stocktotal) {
            return res.sendStatus(400)
        }

        const pricePerDay = await db.query(`SELECT priceperday FROM games WHERE id = $1;`, [gameId])
        const originalPrice = daysRented * pricePerDay.rows[0].priceperday

        await db.query(`INSERT
             INTO
              rentals (customerid, gameid, rentdate, daysrented, returndate, originalprice, delayfee)
               VALUES
                ($1, $2, NOW(), $3, NULL, $4, NULL);`,
            [customerId, gameId, daysRented, originalPrice])

        res.sendStatus(200)
    } catch (err) {
        console.log(err)
        return res.sendStatus(500)
    }

}