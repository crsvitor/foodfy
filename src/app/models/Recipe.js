const { date } = require('../../lib/utils');
const db = require('../../config/db');

module.exports = {
    all() {
        const query = `
            SELECT recipes.*, chefs.name AS chef_name
            FROM recipes 
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            ORDER BY recipes.created_at DESC`;

        return db.query(query);
    },
    create(data) {
        const query = `
            INSERT INTO recipes (
                title,
                ingredients,
                preparation,
                information,
                created_at,
                updated_at,
                chef_id,
                user_id
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id
        `;

        const values = [
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            date(Date.now()).now,
            date(Date.now()).now,
            data.chef,
            data.userId
        ];

        return db.query(query, values);
    },
    find(id) {
        return db.query(`SELECT recipes.*, chefs.name AS chef_name 
        FROM recipes 
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        WHERE recipes.id = $1`, [id]);
    },
    findBy(filter) {
        let filterQuery = "",
            totalQuery = `
                SELECT recipes.*, chefs.name AS chef_name
                FROM recipes 
                LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            `;

        if (filter) {
            filterQuery = `
                WHERE recipes.title ILIKE '%${filter}%'
            `;

            totalQuery = `
                SELECT recipes.*, chefs.name AS chef_name
                FROM recipes 
                LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
                ${filterQuery}
            `;
        }

        return db.query( totalQuery );
    },
    findByChef(id){
        return db.query(`SELECT recipes.*, chefs.name AS chef_name 
        FROM recipes 
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        WHERE chefs.id = $1`, [id]);
    },
    findByUser(id) {
        return db.query(`
            SELECT * FROM RECIPES WHERE user_id = $1
        `, [id]);
    },
    update(data) {
        const query = `
            UPDATE recipes SET
                title=($1),
                ingredients=($2),
                preparation=($3),
                information=($4),
                chef_id=($5)
            WHERE id=($6)
        `;

        const values = [
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            data.chef,
            data.id
        ];

        return db.query(query, values);
    },
    chefSelectOptions(callback) {
        return db.query(`SELECT name, id FROM chefs`);
    },
    async delete(id) {
        await db.query(`DELETE FROM recipe_files WHERE recipe_files.recipe_id = $1`, [id]);

        return db.query(`DELETE FROM recipes WHERE id=$1`, [id])
    },
    paginate(params) {
        const { filter, limit, offset } = params;

        let query = "",
            filterQuery = "",
            totalQuery = `(
                SELECT count(*) FROM recipes
            ) AS total`;

        if (filter) {
            
            filterQuery = `WHERE recipes.title ILIKE '%${filter}%'`;

            totalQuery = `(
                SELECT count(*) FROM recipes
                    ${filterQuery}
                ) AS total
            `;
        }

        query = `
                SELECT recipes.*, ${totalQuery}, chefs.name AS chef_name
                FROM recipes
                LEFT JOIN chefs ON ( recipes.chef_id = chefs.id )
                ${filterQuery}
                ORDER BY recipes.updated_at DESC
                LIMIT $1 OFFSET $2
            `;

        return db.query(query, [limit, offset]);
    }, 
    files(id) {
        return db.query(`
            SELECT files.* 
            FROM files 
            LEFT JOIN recipe_files ON (files.id = recipe_files.file_id)
            LEFT JOIN recipes ON (recipes.id = recipe_files.recipe_id) 
            WHERE recipes.id = $1
        `, [id]);
    }  
}