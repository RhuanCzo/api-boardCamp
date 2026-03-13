import db from "../database/db.js"
import dayjs from "dayjs"

export async function listRentals(req, res) {
    const { customerId, gameId } = req.query;

    try {
        let query = `
            SELECT 
                rentals.*,
                customers.id AS "customerId",
                customers.name AS "customerName",
                games.id AS "gameId",
                games.name AS "gameName",
                games."categoryId",
                categories.name AS "categoryName"
            FROM rentals
                JOIN customers ON rentals."customerId" = customers.id
                JOIN games ON rentals."gameId" = games.id
                LEFT JOIN categories ON games."categoryId" = categories.id
        `;

        const params = [];

        if (customerId) {
            params.push(customerId);
            query += ` WHERE rentals."customerId" = $1`;
        }

        if (gameId) {
            params.push(gameId);
            query += params.length === 1
                ? ` WHERE rentals."gameId" = $1`
                : ` AND rentals."gameId" = $2`;
        }

        const result = await db.query(query, params);

        const rentals = result.rows.map(r => ({
            id: r.id,
            customerId: r.customerId,
            gameId: r.gameId,
            rentDate: r.rentDate,
            daysRented: r.daysRented,
            returnDate: r.returnDate,
            originalPrice: r.originalPrice,
            delayFee: r.delayFee,
            customer: {
                id: r.customerId,
                name: r.customerName
            },
            game: {
                id: r.gameId,
                name: r.gameName,
                categoryId: r.categoryId,
                categoryName: r.categoryName
            }
        }));

        return res.send(rentals);

    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
}


export async function insertRental(req, res) {
    const { customerId, gameId, daysRented } = req.body

    try {

        if (daysRented <= 0) {
            return res.sendStatus(400)
        }

        const customerExist = await db.query(
            `SELECT * FROM customers WHERE id = $1;`,
            [customerId]
        )

        if (customerExist.rows.length === 0) {
            return res.sendStatus(400)
        }

        const gameExist = await db.query(
            `SELECT * FROM games WHERE id = $1;`,
            [gameId]
        )

        if (gameExist.rows.length === 0) {
            return res.sendStatus(400)
        }

        const gameData = gameExist.rows[0]

        const rentalsOpen = await db.query(
            `SELECT * 
             FROM rentals 
             WHERE "gameId" = $1 AND "returnDate" IS NULL;`,
            [gameId]
        )

        if (rentalsOpen.rows.length >= gameData.stockTotal) {
            return res.sendStatus(400)
        }

        const originalPrice = daysRented * gameData.pricePerDay

        await db.query(`
            INSERT INTO rentals 
            ("customerId","gameId","rentDate","daysRented","returnDate","originalPrice","delayFee")
            VALUES ($1,$2,NOW(),$3,NULL,$4,NULL);
        `,
            [customerId, gameId, daysRented, originalPrice])

        return res.sendStatus(201)

    } catch (err) {
        console.log(err)
        return res.sendStatus(500)
    }
}


export async function finishRental(req, res) {
    const { id } = req.params
    console.log(id)

    try {
        const rental = await db.query(`SELECT * FROM rentals WHERE id = $1;`, [id])

        if (rental.rows.length === 0) {
            return res.sendStatus(404)
        }
        const rentalData = rental.rows[0]
        if (rentalData.returnDate !== null) {
            return res.sendStatus(400)
        }

        const game = await db.query(`SELECT
             "pricePerDay" FROM
              games WHERE
               id = $1;`,
            [rentalData.gameId])

        const pricePerDay = game.rows[0].pricePerDay

        const today = dayjs()
        const rentDate = dayjs(rentalData.rentDate);
        const daysPassed = today.diff(rentDate, "day")
        const delayDays = daysPassed - rentalData.daysRented

        let delayFee = 0

        if (delayDays > 0) {
            delayFee = pricePerDay * delayDays
        }
        await db.query(`UPDATE rentals SET "returnDate" = NOW(), "delayFee" = $1 WHERE id = $2;`, [delayFee, id])
        return res.sendStatus(200)

    } catch (err) {
        console.log(err)
        return res.sendStatus(500)
    }
}

export async function deleteRental(req, res) {
    const { id } = req.params

    try {
        const rental = await db.query(`SELECT * FROM rentals WHERE id = $1;`, [id])
        const rentalData = rental.rows[0]

        if (rental.rows.length === 0) {
            return res.sendStatus(404)
        }
        if (rentalData.returnDate === null) {
            return res.sendStatus(400)
        }

        await db.query(`DELETE FROM rentals WHERE id = $1;`, [id])

        return res.sendStatus(200)
    } catch (err) {
        console.log(err)
        return res.sendStatus(500)
    }

}