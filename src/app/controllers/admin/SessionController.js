const crypto = require('crypto');
const { hash } = require('bcryptjs');
const User = require('../../models/User');
const mailer = require('../../../lib/mailer');

module.exports = {
    index(req, res) {
        return res.render('./admin/home-page/index');
    },
    loginToForm(req, res) {
        return res.render('./admin/session/login');
    },
    login(req, res) {
        req.session.userId = req.user.id;

        return res.redirect("/admin/");
    },
    logout(req, res) {
        req.session.destroy();
        return res.redirect("/");
    },
    forgotPasswordToForm(req, res) {
        return res.render('./admin/session/forgot-password');
    },
    async forgotPassword(req, res) {
        const user = req.user;

        try{
            const token = crypto.randomBytes(20).toString('hex');

            let now = new Date();
            now = now.setHours(now.getHours() + 1);

            await User.update(user.id, {
                reset_token: token,
                reset_token_expires: now
            });

            await mailer.sendMail({
                to: user.email,
                from: 'no-reply@foodfy.com.br',
                subject: 'Recuperação de senha',
                    html: `<h2>Esqueceu da Senha?</h2>
                    <p>Não se preocupe, clique no link abaixo para recuperar!</p>
                    <p>
                        <a href="http://localhost:3000/admin/reset-password?token=${token}" target="_blank">
                            RECUPERAR SENHA
                        </a>
                    </p>
                    `
            });

            return res.render("./admin/session/forgot-password", {
                success: "Verifique seu email para resetar sua senha!"
            });

        } catch(err) {
            console.error(err);
            return res.render("./admin/session/forgot-password", {
                error: "Um erro ocorreu, tente novamente!"
            });
        }
    },
    resetPasswordToForm(req, res) {
        return res.render('./admin/session/reset-password', { token: req.query.token });
    },
    async resetPassword(req, res) {
        const user = req.user;
        const { password, token } = req.body;

        try {
            const newPassowrd = await hash(password, 8);

            await User.update(user.id, {
                password: newPassowrd,
                reset_token: "",
                reset_token_expires: ""
            });

            return res.render("./admin/session/login", {
                user: req.body,
                success: "Senha atualizada! Faça seu login!"
            });
        } catch (err) {
            console.error(err);
            return res.render("./admin/session/reset-password", {
                user: req.body,
                token,
                error: "Um erro ocorreu, tente novamente!"
            });
        }
    }
}