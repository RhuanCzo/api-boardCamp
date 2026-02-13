import db from "../database/db.js"

export async function InsertCategorie(req, res) {
    const { name } = req.body

    try {
        await db.query('INSERT INTO categories (name) VALUES ($1);',[name])
        res.sendStatus(201)
    } catch (err) {
        console.log(err)
        self.sendStatus(401)
    }

}