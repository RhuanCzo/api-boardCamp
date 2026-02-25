import db from "../database/db.js"

export async function listCustomers(req, res) {
    const { cpf } = req.query
    console.log("getAll")

    try {
        if (cpf) {
            const listCustomersByCpf = await db.query('SELECT * FROM customers WHERE cpf ILIKE $1;', [`${cpf}%`])
            return res.send(listCustomersByCpf.rows)
        }
        const listCustomers = await db.query('SELECT * FROM customers')

        res.send(listCustomers.rows)
    } catch (err) {
        console.log(err)
        res.sendStatus(400)
    }
}

export async function listCustomersById(req, res) {
    const { id } = req.params

    try {

        const listCustomers = await db.query(`SELECT * FROM customers WHERE customers.id = $1;`, [id])
        if (listCustomers.rows.length === 0) {
            return res.sendStatus(404)
        }
        console.log(listCustomers.rows)
        res.send(listCustomers.rows)

    } catch (err) {
        console.log(err)
        res.sendStatus(400)
    }
}

export async function insertCustomer(req, res) {
    const customer = req.body
    console.log(customer)

    if (customer.cpf.length !== 11) {
        return res.sendStatus(400)
    }
    if (customer.name !== null) {
        return res.sendStatus(400)
    }

    try {
        await db.query(
            `INSERT INTO
             customers (name, phone, cpf, birthday) 
             VALUES
              ($1, $2, $3, $4);`,
            [customer.name, customer.phone, customer.cpf, customer.birthday]
        )
        res.sendStatus(200)
    } catch (err) {
        console.log(err)
    }

}

export async function updateCustomers(req, res) {
    const { id } = req.params
    const customer = req.body

    try {
        await db.query(`UPDATE customers SET name = $1, phone = $2, cpf = $3, birthday = $4 WHERE customers.id = $5`,
            [customer.name, customer.phone, customer.cpf, customer.birthday, id])
        res.sendStatus(200)
    } catch (err) {
        console.log(err)
        return res.sendStatus(401)
    }
}

