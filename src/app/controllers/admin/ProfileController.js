const Chef = require('../../models/Chef');
const Recipe = require('../../models/Recipe');
const File = require('../../models/File');

module.exports = {
    index(req, res) {
        return res.render('./admin/profile/index');
    },
    put(req, res) {
        
    }
}