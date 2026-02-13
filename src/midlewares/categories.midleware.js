import db from "../database/db.js"

export default async function categoriesVerification (req, res, next) {
    const category = req.body

    const categoryExist = await db.query('SELECT * FROM categories WHERE name = ($1);', [category.name])
    if(category.name === null) {
        return res.sendStatus(400)
    }
    if(categoryExist.rows.length > 0) {
        return res.sendStatus(409)
    }
    next()
}