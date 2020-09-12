const db = require('../../../config/db');
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
        let { is_admin } = req.body;

        if (is_admin != 'true') {
            is_admin = false;
        }

        const userId = await User.create(req.body);

        req.session.userId = userId;


        const users = await User.list();

        return res.render('./admin/user/index', { 
            users,
            success: "Usuário cadastrado com sucesso!"
        });
    },
    async edit(req, res) {
        const { id } = req.params;

        const user = await User.findOne({ Where: { id } })
        
        return res.render('./admin/user/edit', { user });
    },
    async put(req, res) {
        let { id, name, email, is_admin } = req.body;

        if (is_admin != 'true') {
            is_admin = false;
        }

        const user = await User.update(id, {
            name,
            email,
            is_admin
        });

        const users = await User.list();

        return res.render('./admin/user/index', {
            users,
            success: "Usuário atualizado com sucesso!"
         });
    },
    async delete(req, res) {
        const { id } = req.body;

        await User.delete(id);

        return res.redirect('/admin/users');
    }
}