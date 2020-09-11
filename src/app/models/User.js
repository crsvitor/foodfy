const db = require('../../config/db');
const { date } = require('../../lib/utils');
const { hash } = require('bcryptjs');
const fs = require('fs');

const Product = require('./Recipe');
const { create } = require('./Recipe');

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
                false || data.is_admin,
                date(Date.now()).now
            ];

            const results = await db.query(query, values);
            return results.rows[0].id;
            
        } catch(err) {

        }
    }
}