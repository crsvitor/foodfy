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
    forgotPassword(req, res) {
        
    },
    resetPasswordToForm(req, res) {
        return res.render('./admin/session/reset-password');
    },
    resetPassword(req, res) {
        
    }
}