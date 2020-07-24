const db = require('../../config/db');
const { date } = require('../../lib/utils');

module.exports = {
    all(calback) {
        const query = `
            SELECT recipes.*, chefs.name AS chef_name
            FROM recipes 
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        `;

        db.query( query, function(err, results) {
            if(err) throw `Database error! ${err}`;

            calback(results.rows);
        });
    },
    create(data, callback) {
        const query = `
            INSERT INTO recipes (
                image,
                title,
                ingredients,
                preparation,
                information,
                created_at,
                chef_id
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id
        `;

        const values = [
            data.image,
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            date(Date.now()).iso,
            data.chef
        ];

        db.query(query, values, function(err, results) {
            if(err) throw `Database error! ${err}`;

            callback(results.rows[0]);
        });
    },
    find(id, callback) {
        db.query(`SELECT recipes.*, chefs.name AS chef_name 
        FROM recipes 
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        WHERE recipes.id = $1`, [id], function(err, results) {
                if (err) throw `Database Error! ${err} `;

                callback(results.rows[0]);
            });
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
    update(data, callback) {
        const query = `
            UPDATE recipes SET
                image=($1),
                title=($2),
                ingredients=($3),
                preparation=($4),
                information=($5),
                chef_id=($6)
            WHERE id=($7)
        `;

        const values = [
            data.image,
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            data.chef,
            data.id
        ];

        db.query(query, values, function(err, results) {
            if (err) throw `Database Error! ${err} `;
            
            callback(results.rows[0]);
        });
    },
    chefSelectOptions(callback) {
        db.query(`SELECT name, id FROM chefs`, function(err, results) {
            if (err) throw `Database Error! ${err} `;
            
            callback(results.rows);
        });
    },
    delete(id, callback) {
        db.query(`DELETE FROM recipes WHERE id=$1`, [id], function(err, results) {
            if (err) throw `Database Error! ${err} `;
            
            callback(results.rows);
        });
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
    }  
}