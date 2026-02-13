import db from "../database/db.js"

export async function listCustomers (req, res) {

    try {
        const listCustomers = await db.query('SELECT * FROM customers')
        
        res.send(listCustomers.rows)
    } catch (err) {
        console.log(err)
        res.sendStatus(400)
    }
    
}

export async function listCustomersByCpf (req, res) {
    const {cpf} = req.params
    console.log(cpf)

    try {
        const listCustomers = await db.query('SELECT * FROM customers WHERE cpf = ($1);', [cpf])
        res.send(listCustomers.rows[0])
    } catch (err) {
        console.log(err)
        res.sendStatus(400)
    }
    
    
}

