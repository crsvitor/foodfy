const db = require('../../config/db');
const { date } = require('../../lib/utils');
const { hash } = require('bcryptjs');
const fs = require('fs');

const Product = require('./Recipe');
// const { put } = require('../validators/user');
// const { index } = require('../controllers/admin/ProfileController');
// const { array } = require('../middlewares/multer');

module.exports = {
    async list() {
        const query = `
            SELECT * FROM users
        `;

        const results = await db.query(query);
        return results.rows;        
    },
    async findOne(filters) {
        try {
            let query = `SELECT * FROM users`;
    
            Object.keys(filters).map(key => {
                query = `${query}
                ${key}
                `
                Object.keys(filters[key]).map(field => {
                    query = `${query} ${field} = '${filters[key][field]}'`
                });
            });
    
            const results = await db.query(query);
            return results.rows[0];

        } catch(err) {
            console.error(err);
    }
    },
    async create(data) {
        try {
            const query = `
                INSERT INTO users (
                    name,
                    email,
                    password,
                    is_admin,
                    created_at
                ) VALUES ($1, $2, $3, $4, $5)
                RETURNING id
            `;

            const password = "a";

            const values = [
                data.name,
                data.email,
                password,
                data.is_admin,
                date(Date.now()).now
            ];

            const results = await db.query(query, values);
            return results.rows[0].id;
            
        } catch(err) {
            console.error(err);

        }
    },
    async update(id, fields){
        try {
            let query = "UPDATE users SET";

            Object.keys(fields).map((key, index, array) => {
                if ((index + 1) < array.length) {
                    query = `${query}
                        ${key} = '${fields[key]}',
                    `
                } else {
                    query = `${query}
                        ${key} = '${fields[key]}'
                        WHERE id = ${id}
                    `
                }
            });

            await db.query(query);
            return  
        } catch(err) {
            console.error(err);
        }
    },
    async delete(id) {
        const query = `
            DELETE FROM users WHERE id = $1
        `;

        return db.query(query, [id]);
    }
}