const Chef = require('../../models/Chef');
const Recipe = require('../../models/Recipe');
const File = require('../../models/File');

module.exports = {
    list(req, res) {

        return res.render('./admin/user/index');
    }
}