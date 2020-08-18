const db = require('../../config/db');
const { date } = require('../../lib/utils');

module.exports = {
    all() {
        const query = `
            SELECT recipes.*, chefs.name AS chef_name
            FROM recipes 
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        `;

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
                chef_id
            ) VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id
        `;

        const values = [
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            date(Date.now()).iso,
            data.chef
        ];

        return db.query(query, values);
    },
    find(id) {
        return db.query(`SELECT recipes.*, chefs.name AS chef_name 
        FROM recipes 
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        WHERE recipes.id = $1`, [id]);
    },
    findByChef(id){
        return db.query(`SELECT recipes.*, chefs.name AS chef_name 
        FROM recipes 
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        WHERE chefs.id = $1`, [id]);
    },
    findBy(filter, callback) {
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

        db.query( totalQuery, function(err, results) {
            if (err) throw `Database Error! ${err} `;
            
            callback(results.rows);
        });
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
        const { filter, limit, offset, callback } = params;

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
                LIMIT $1 OFFSET $2
            `;

        db.query(query, [limit, offset], function(err, results) {
            if (err) throw `Database Error! ${err} `;

            callback(results.rows);
        });        
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