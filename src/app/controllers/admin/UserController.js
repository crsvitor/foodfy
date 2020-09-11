const User = require('../../models/User');

module.exports = {
    list(req, res) {
        return res.render('./admin/user/index');
    },
    create(req, res) {
        return res.render('./admin/user/register');
    },
    async post(req, res) {
        return res.send("passed");
    },
    put(req, res) {

    },
    delete(req, res) {

    }
}