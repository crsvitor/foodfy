const User = require('../models/User');
const Recipe = require('../models/Recipe');

async function onlyUsers(req, res, next) {
    if (!req.session.userId) {
        return res.redirect('/admin/login');
    }

    next();
}

async function onlyAdmins(req, res, next) {
    const { userId: id } = req.session;
    
    const user = await User.findOne({ Where: { id } });

    const users = await User.list();

    if (user.is_admin == false) {
        return res.render('./admin/home-page/index', {
            users,
            error: "Tal processo é apenas para Adminitradores!"
        });
    }
    
    next();
}

module.exports = {
    onlyUsers,
    onlyAdmins
}