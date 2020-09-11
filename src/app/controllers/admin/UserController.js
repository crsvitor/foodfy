const User = require('../../models/User');

module.exports = {
    async list(req, res) {
        const users = await User.list();

        return res.render('./admin/user/index', { users });
    },
    create(req, res) {
        return res.render('./admin/user/register');
    },
    async post(req, res) {

        const userId = await User.create(req.body);

        req.session.userId = userId;

        return res.redirect('/admin/users');
    },
    async edit(req, res) {
        const { id } = req.params;

        const user = await User.findOne({ Where: { id } })
        
        return res.render('./admin/user/edit', { user });
    },
    async put(req, res) {

    },
    delete(req, res) {

    }
}