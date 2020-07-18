const db = require('../../config/db');

module.exports = {
    all(calback) {
        db.query(`SELECT * FROM recipes`, function (err, results) {
            if(err) throw `Database Error ${err}`;

            callback(results.rows);
        });
    },
    create(data, callback) {

    },
    find(id, callback) {

    },
    findBy(filter, callback) {

    },
    update(filter, callback) {

    },
    delete(id, callback) {

    },
    paginate(params) {

    }  
}