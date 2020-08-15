const db = require('../../config/db');

module.exports = {
    async create({filename, path, recipe_id}) {
        let query = `
            INSERT INTO files (
                name,
                path
            ) VALUE ($1, $2)
            RETURNING id
        `;

        let values = [
            filename,
            path
        ];

        const results = await db.query(query, values);
        const fileId = results.rows[0].id;

        query = `
            INSERT INTO recipe_files (
                recipe_id,
                file_id
            ) VALUE ($1, $2)
            RETURNING id
        `;

        values = [
            recipe_id,
            fileId
        ];

        return db.query(query, values);
    },
    async createChefFile({filename, path}) {
        let query = `
            INSERT INTO files (
                name,
                path
            ) VALUE ($1, $2)
            RETURNING id
        `;

        let values = [
            filename,
            path
        ];

        return db.query(query, values);
    },
    async delete(id) {
        try {
            let result = await db.query(`SELECT * FROM files WHERE id = $1`, [id]);
            const file = result.rows[0];
            
            result = await db.query(`SELECT * FROM recipes_files WHERE recipes_files.file_id = $1`, [id]);
            const recipes_files = result.rows[0];

        } catch {
            console.error(err);
        }

        await db.query(`DELTE FROM recipes_files WHERE recipes_files.file_id = $1`, [id]);

        await db.query(`DELETE FROM files WHERE id = $1`, [id]);
    
        return
    }
}