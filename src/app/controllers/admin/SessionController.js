module.exports = {
    loginToForm(req, res) {
        return res.render('./admin/session/login');
    },
    login(req, res) {
        
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