const crypto = require('crypto');
const { hash } = require('bcryptjs');
const mailer = require('../../../lib/mailer');
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
        let { email, is_admin } = req.body;
        
        const token = crypto.randomBytes(20).toString('hex');

        const randomPassword = crypto.randomBytes(4).toString("hex");
        req.body.password = randomPassword;
        
        const userId = await User.create(req.body);
        req.session.userId = userId;
        const { userId: id } = req.session;
        
        let now = new Date();
        now = now.setHours(now.getHours() + 72);

        await User.update(id, {
            reset_token: token,
            reset_token_expires: now
        });

        await mailer.sendMail({
            to: email,
            from: 'no-reply@foodfy.com.br',
            subject: 'Cadastro com sucesso! Altere sua senha pré definida!',
            html: `<h2>Criamos um senha pré definida para sua entrada no sistema, e estamos enviando este email para que você atualizar como preferir!</h2>
            <h3>Sua senha é: ${randomPassword}</h3>
            <p>Clique no link abaixo para alterá-la!</p>
            <p>
                <a href="http://localhost:3000/admin/reset-password?token=${token}" target="_blank">
                NOVA SENHA
                </a>
                <p>ps: Este email com o link de alteração de senha é válido apenas para as próximas 72 horas. Após isso é necessário usar a opção do site "Perdeu a senha?" para alterá-la.</p>
            </p>
            `
        });

        if (is_admin != 'true') {
            is_admin = false;
        }

        const users = await User.list();

        return res.render('./admin/user/index', { 
            users,
            success: "Usuário cadastrado com sucesso! Confire o e-mail cadastrado!"
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