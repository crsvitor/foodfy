const db = require('../../config/db');
const fs = require('fs');

module.exports = {
    async create({filename, path, recipe_id}) {
        let query = `
            INSERT INTO files (
                name,
                path
            ) VALUES ($1, $2)
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
            ) VALUES ($1, $2)
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
            ) VALUES ($1, $2)
            RETURNING id
        `;

        let values = [
            filename,
            path
        ];

        return db.query(query, values);
    },
    async show(id) {
        return db.query(`
        SELECT * FROM files WHERE id = $1`, [id]);
    },
    async delete(id) {
        try {
            let result = await db.query(`SELECT * FROM files WHERE id = $1`, [id]);
            const file = result.rows[0];

            result = await db.query(`SELECT * FROM recipe_files WHERE recipe_files.file_id = $1`, [id]);
            const recipe_files = result.rows[0];

        } catch {
            console.error(err);
        }

        await db.query(`DELETE FROM recipe_files WHERE recipe_files.file_id = $1`, [id]);

        return db.query(`DELETE FROM files WHERE id = $1`, [id]);
    },
    async deleteFromRecipeFiles(id) {
        try{
            const result = await db.query(`SELECT * FROM recipe_files WHERE file_id = $1`, [id])
            const file = result.rows[0]

            fs.unlinkSync(file.path)

        }catch(err){
            console.error(err)
        }

        return db.query(`
        DELETE FROM recipe_files WHERE file_id = $1`, [id])
    },
    deleteFromFiles(id){
        return db.query(`
        DELETE FROM files WHERE id = $1`, [id])
    }
}